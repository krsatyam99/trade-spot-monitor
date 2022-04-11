import * as WebSocket from "ws";
import logger from "../lib/logger";

class PriceOracle {
  baseUrl: String;
  _path: String;
  _handlers: Map<any, any>;
  _id: number;
  isConnected: boolean;
  _ws: any;
  dataFormat: dataFormat;


  constructor(path: string, dataFormat: dataFormat, baseUrl: string,) {
    this.dataFormat = dataFormat;
    this.baseUrl = baseUrl || "wss://stream.binance.com/";
    this._path = path;
    this._createSocket();
    this._handlers = new Map();
    this._id = 0;
    this.isConnected = false;
  }

  subscribeStream(stream: String) {
    if (this.isConnected) {
      this._ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${stream}@trade`],
          id: this._id,
        })
      );
      logger.info("Listening to stream " + stream);
      ++this._id;
    } else {
      setTimeout(() => {
        this.subscribeStream(stream);
      }, 1000);
    }
  }

  getPathValue(payload: JSONObject, path: string) {
    const jsonpath = path.split(".");
    for (let i = 0; i < jsonpath.length; i++) {
      payload = payload[jsonpath[i]];
    }
    return payload;
  }

  _createSocket() {
    logger.info(`${this.baseUrl}${this._path}`);
    this._ws = new WebSocket.default(`${this.baseUrl}${this._path}`);

    this._ws.onopen = () => {
      logger.info("ws connected");
      this.isConnected = true;
    };

    this._ws.on("pong", () => {
      logger.debug("receieved pong from server");
    });
    this._ws.on("ping", () => {
      logger.debug("==========receieved ping from server");
      this._ws.pong();
    });

    this._ws.onclose = () => {
      logger.warn("ws closed");
    };

    this._ws.onerror = (err: any) => {
      logger.warn("ws error", err);
    };

    this._ws.onmessage = (msg: webSocketMessage) => {
      try {
        const message = JSON.parse(msg.data);
        if (this.isMultiStream(message)) {
          this._handlers.get(message.stream).forEach((cb: callbackFunction) => cb(
            {
              price: this.getPathValue(message, this.dataFormat.price),
              timestamp: this.getPathValue(message, this.dataFormat.timestamp),
              entityName: this.getPathValue(message, this.dataFormat.entityName)
            }));
        } else if (message.e && this._handlers.has(message.e)) {
          this._handlers.get(message.e).forEach((cb: callbackFunction) => {
            cb({
              price: this.getPathValue(message, this.dataFormat.price),
              timestamp: this.getPathValue(message, this.dataFormat.timestamp),
              entityName: this.getPathValue(message, this.dataFormat.entityName)
            });
          });
        } else {
          logger.info(message);
        }
      } catch (e) {
        logger.warn("Parse message failed", e);
      }
    };

    this.heartBeat();
  }

  isMultiStream(message: JSONObject) {
    return message.stream && this._handlers.has(message.stream);
  }

  heartBeat() {
    setInterval(() => {
      if (this._ws.readyState === WebSocket.OPEN) {
        this._ws.ping();
        logger.debug("ping server");
      }
    }, 5000);
  }

  setHandler(method: string, callback: messageCallback) {
    if (!this._handlers.has(method)) {
      this._handlers.set(method, []);
    }
    this._handlers.get(method).push(callback);
  }
}

export default PriceOracle;
