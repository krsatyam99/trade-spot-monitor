#!/usr/bin/env node

import PriceOracle from "./PriceOracle";
import Action from "./Action";

export enum comparisonOperators {
  gt = ">",
  eq = "===",
  lt = "<",
  lte = "<=",
  gte = ">=",
};
class Trigger {
  tradePairs: tradePair[];
  action: Action;
  priceOracle: PriceOracle;

  constructor(tradePairs: tradePair[], priceOracle: PriceOracle, action: Action) {
    this.tradePairs = tradePairs;
    this.priceOracle = priceOracle
    this.action = action;
  }

  compare(operator: String, currentValue: Number, triggerValue: Number) {
    const operators = comparisonOperators;
    switch (operator) {
      case operators.eq:
        return currentValue === triggerValue;
      case operators.gt:
        return currentValue > triggerValue;
      case operators.lt:
        return currentValue < triggerValue;
      case operators.lte:
        return currentValue <= triggerValue;
      case operators.gte:
        return currentValue >= triggerValue;
      default:
        return false;
    }
  }

  listenStream() {
    const socketClient = this.priceOracle;

    this.tradePairs.forEach((pair) => {
      socketClient.subscribeStream(pair.streamName);
    });

    const previousPrices: PreviousPrices = {};
    socketClient.setHandler("trade", (params: messagePayload) => {
      const tradePair = this.tradePairs.find(
        (x) => x.streamName.toLowerCase() === params.entityName.toLowerCase()
      );

      if (
        !previousPrices[params.entityName] ||
        (previousPrices[params.entityName] && previousPrices[params.entityName] !== params.price)
      ) {
        if (tradePair) {
          if (this.compare(tradePair.comparisonOperator, params.price, tradePair.value)) {
            this.action.excuteAction(params);
          }
          previousPrices[params.entityName] = params.price;
        }
      }
    });
  }
}

export default Trigger;
