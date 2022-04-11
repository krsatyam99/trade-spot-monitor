type tradePair = {
    streamName: String,
    comparisonOperator: String,
    value: number,
};

type messagePayload = {
    price: number,
    timestamp: Date,
    entityName: string,
}

type PreviousPrices = {
    [key: string]: Number
}

type JSONObject = {
    [key: string]: any
}
type stringObject = {
    [key: string]: string
}
type dataFormat = {
    price: string,
    timestamp: string,
    entityName: string,
}

type webSocketMessage = { data: string }

type callbackFunction = (object) => void

type messageCallback = (messagePayload) => void