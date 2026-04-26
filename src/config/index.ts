import dev from "./env.dev"
import prod from "./env.prod"

const ENV = __DEV__ ? dev : prod

export default ENV
