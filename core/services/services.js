class Services {

  constructor() {
  }

  callbackHandler(values, callback){
    if(values.Error || !values.Message.ok)
      callback({
        status: false,
        error: values.error.message,
        date: values.header
      });

    else{
      callback({
        status: true,
        id: values.message.id,
        rev: values.message.rev,
        location: values.header.location,
        date: values.header.date
      });
    }
  }

  logger(values, errorMessage, successMessage) {

    console.log(new Date(values.header.date));

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

  manager(error, message, header) {
    callbackHandler({
        'error': error,
        'message':message,
        'header': header
      }, callback);

      logger({
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