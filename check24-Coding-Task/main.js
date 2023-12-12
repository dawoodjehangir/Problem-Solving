//global cloud
const cloud = [];

// global fixed values
const cores = 4;
const bandwidth = 1000;
const memory = 2500;

//Template for creating new Machines
class Machine {
  constructor(machineId, userId = null) {
    this.machineId = machineId;
    this.userId = userId;
    this.cores = cores;
    this.bandwidth = bandwidth;
    this.memory = memory;
  }
}

//Template for creating new Containers
class Container {
  constructor(userId = null, machineId = null, cores, bandwidth, memory) {
    this.userId = userId;
    this.machineId = machineId;
    this.cores = cores;
    this.bandwidth = bandwidth;
    this.memory = memory;
  }
}

///////////////////////////////////////////////////////////////////////////////////
// each object denoting a single container
// the generation can be automated later. For now it is fixed
const user1 = [
  new Container(1, null, 1, 650, 700),
  new Container(1, null, 2, 200, 1300),
  new Container(1, null, 1, 200, 50),
  new Container(1, null, 1, 200, 50),
  new Container(1, null, 2, 700, 700),
];
const user2 = [new Container(2, null, 3, 800, 1500)];
const users = [user1, user2];

////////////////////////////////////////////////////////////////////////////////////

function utilizeResources(container, machine) {
  container.machineId = machine.machineId;
  machine.cores -= container.cores;
  machine.bandwidth -= container.bandwidth;
  machine.memory -= container.memory;
}

function allocateContainerToMachine(container, machine) {
  let remainingCores = machine.cores - container.cores;
  let remainingBandwidth = machine.bandwidth - container.bandwidth;
  let remainingMemory = machine.memory - container.memory;

  if (remainingCores < 0 || remainingBandwidth < 0 || remainingMemory < 0) {
    cloud.push(machine);
    let newMachine = new Machine(cloud.length + 1, container.userId);
    utilizeResources(container, newMachine);
    return newMachine;
  } else {
    utilizeResources(container, machine);
    return machine;
  }
}

// upload to cloud
function uploadToCloud(users, cloud) {
  for (let i = 0; i < users.length; i++) {
    const listOfUserContainers = users[i];
    let newMachine = new Machine(cloud.length + 1, i + 1);
    for (let j = 0; j < listOfUserContainers.length; j++) {
      let oneContainer = listOfUserContainers[j];
      newMachine = allocateContainerToMachine(oneContainer, newMachine);
    }
    cloud.push(newMachine);
  }
}

uploadToCloud(users, cloud);
console.log(`${JSON.stringify(cloud)}\n\n`);
console.log(`${JSON.stringify(user1)}\n\n`);
console.log(`${JSON.stringify(user2)}\n\n`);
