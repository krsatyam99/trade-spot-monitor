import { comparisonOperators } from "./Services/Trigger";

const config: { tradePairs: tradePair[] } = {
  tradePairs: [
    {
      streamName: "btcusdt",
      comparisonOperator: comparisonOperators.lt,
      value: 47435.5,
    },
    {
      streamName: "ethbtc",
      comparisonOperator: comparisonOperators.gt,
      value: 40000,
    },
    {
      streamName: "etcbtc",
      comparisonOperator: comparisonOperators.gt,
      value: 40000,
    },
    {
      streamName: "ethusdt",
      comparisonOperator: comparisonOperators.gt,
      value: 40000,
    },
    {
      streamName: "omgbtc",
      comparisonOperator: comparisonOperators.gt,
      value: 40000,
    },
  ],
};

export default config;
