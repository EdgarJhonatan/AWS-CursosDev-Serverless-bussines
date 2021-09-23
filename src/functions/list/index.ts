import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  layers: ["${ssm:/group01/${self:provider.stage}/layer}"],
  name: "${self:custom.channel.name}-${self:provider.stage}-${self:custom.lambda.type}-list-medics",
};
