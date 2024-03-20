import Component from "../../../shell/Component";

@Component("li")
export default class Li {
  constructor(attributes) {
    console.log(attributes);
  }
}
