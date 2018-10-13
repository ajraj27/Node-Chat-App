class Users{
  constructor(){
    this.users=[];
  }

  addUser(id,name,room){
    const user={id,name,room};
    this.users.push(user);
    return user;
  }

  removeUser(id){
    const user=this.getUserById(id);

    if(user){
      this.users=this.users.filter((user) => user.id!==id)
    }

    return user;
  }

  getUserByName(name,room){
    return this.users.filter((user) => user.name===name && user.room===room)[0];
  }

  getUserById(id){
    return this.users.filter((user) => user.id===id)[0];
  }


  getUserList(room){
    const users=this.users.filter((user) => user.room==room);
    const namesArray=users.map((user) => user.name);
    return namesArray;
  }
}

module.exports={Users};
