const Project = require('./project_service');
const Module = require('./module_service');
const TC = require('./tc_service');
const BC = require('./bc_service');

class ServiceObjectFactory {
  
  add(item, values){
    switch(item){
        case 'project' : 
          return Project.add('Project', values);
        
        case 'module' : 
          return Module.add('ProjectModule', values);
        
        case 'tc' :
          return TC.add('ProjectTC', values);
        
        case 'bc' : 
          return BC.add('ProjectBC' values);
    }
  }
  
  delete(item, values){
    switch(item){
      
      case 'project' :
        return Project.delete('Project', values);
      
      case 'module' : 
        return Module.delete('ProjectModule', values);
        
      case 'tc' : 
        return TC.delete('ProjectTC', values);
      
      case 'bc' : 
        return BC.delete('ProjectBC', values);
    }
  }
  
  update(item, existingVal, newVal){
    switch(item){
      
      case 'project' :
        return Project.update('Project', existingVal, newVal);
      
      case 'module' : 
        return Module.update('ProjectModule', existingVal, newVal);
        
      case 'tc' : 
        return TC.update('ProjectTC', existingVal, newVal);
        
      case 'bc' : 
        return BC.update('ProjectBC', existingVal, newVal);
    }
  }
  
  get(item, values){
    switch(item){
      
      case 'project' :
        return Project.get('Project', values);
        
      case 'module' :
        return Project.get('ProjectModule', values);
        
      case 'tc' :
        return Project.get('ProjectTC', values);
        
      case 'bc' :
        return Project.get('ProjectBC', values);
        
    }
  }
}


module.exports = new ServiceObjectFactory;