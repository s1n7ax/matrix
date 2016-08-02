class Services {


  constructor() {
    let self = this;
  }

  callbackHandler(values, callback){
    
    if(values.error)
      callback({
        status: false,
        error: values.error.message,
        date: values.error.headers.date
      });

    else if(values.message.ok)
      callback({
        status: true,
        id: values.message.id,
        rev: values.message.rev,
        location: values.header.location,
        date: values.headers.date
      });
      
    else if(!values.message.ok)
        callback({
        status: false,
        error: 'body.ok is false',
        date: values.headers.date
      });
    
  }

  logger(values, errorMessage, successMessage) {

    if(values.error || !values.message.ok){
      console.log(message !== undefined ? errorMessage:'Error!!!' );
      console.log(values.error.message);
    }
    else{
      console.log(message !== undefined ? successMessage:'Successful!!!');
      console.log('ID : '+values.message.id);
      console.log('Rev : '+values.message.rev);
    }
  }

  manager(error, message, header, callback) {
    
//    console.log(error);
    let self = new Services;
    
    self.callbackHandler({
      'error': error,
      'message':message,
      'header': header
    }, callback);

    self.logger({
      'error':error,
      'message': message,
      'header': header
    }, 'Adding item - Error', 'Adding item - Successful');
  }

  add(itemName, values, callback) {
    this.database.insertDoc(values, itemName, this.manager);
  }
  
  delete() {}
  
  rename() {}
  
  get(){}
}

module.exports = Services;