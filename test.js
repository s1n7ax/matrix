class test{
  
  constructor(){
  }
  
  printName() {
    console.log('My name is Nisala');
  }
  
  printHello() {
    let self = new test;
    console.log('hello');
      self.printName();
  }
  
  wait() {
    setTimeout(this.printHello, 1000);
  }
}
let a = new test();
a.wait();
