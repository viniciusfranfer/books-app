export default class ModelError extends Error {
  
    constructor(txtDeErro) {
      super(txtDeErro)
      console.log(txtDeErro + '\n\n' + this.stack)
    }
}