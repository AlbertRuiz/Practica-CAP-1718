function ThreadSystem() {
    this.threads_queue = [];
    this.current_running_thread = {};
    this.continuation;
}


ThreadSystem.prototype.spawn = function(thunk) {
    this.threads_queue.push(thunk);
};

ThreadSystem.prototype.quit = function() {
   if (this.threads_queue.length > 0) {
    this.current_running_thread = this.threads_queue.shift();
    this.current_running_thread();
   }
   else {
    this.current_running_thread = {};
    this.continuation();
   }
};

ThreadSystem.prototype.relinquish = function() {
    this.current_running_thread = this.threads_queue.shift();
    this.threads_queue.push(new Continuation());
    this.current_running_thread();
};

ThreadSystem.prototype.start_threads = function() {
    this.continuation = new Continuation();
    this.current_running_thread = this.threads_queue.shift();
    this.current_running_thread();
};

function make_thread_system() {
    return new ThreadSystem();
}


print('1st Example:');

//--- 1r Exemple Enunciat ---
var counter = 10;
function make_thread_thunk(name, thread_system) {
    function loop() {
        if (counter < 0) {
            thread_system.quit();
        }
        print('in thread',name,'; counter =',counter);
        counter--;
        thread_system.relinquish();
        loop();
    };
    return loop;
}
var thread_sys = make_thread_system();
thread_sys.spawn(make_thread_thunk('a', thread_sys));
thread_sys.spawn(make_thread_thunk('b', thread_sys));
thread_sys.spawn(make_thread_thunk('c', thread_sys));
thread_sys.start_threads();

//--- 2n Exemple Enunciat ---
print(' ');
print('2nd Example:');

function make_thread_thunk2(name, thread_system) {
    function loop() {
    	for(let i=0; i < 5; i++) {
         print('in thread',name,'; i =',i);
         thread_system.relinquish();
		}
    thread_system.quit();
    };
    return loop;
};
var thread_sys2 =  make_thread_system();
thread_sys2.spawn(make_thread_thunk2('a', thread_sys2));
thread_sys2.spawn(make_thread_thunk2('b', thread_sys2));
thread_sys2.spawn(make_thread_thunk2('c', thread_sys2));
thread_sys2.start_threads();

//--- 3r Exemple (Senzill informe)---
print(' ');
print('3rd Example:');

function make_thread_thunk3(thread_name, thread_system) {
    function task() {
        for (let i=1; i < 100; i++) {
            if (i%50 === 0) {
                print('... Computing '+thread_name+' task ...');
            }
        }
        print(thread_name+' has finished');
        thread_system.quit();
        task();
    };
    return task;
};


var simple_thread_sys = make_thread_system();
simple_thread_sys.spawn(make_thread_thunk3('Thread 1',simple_thread_sys));
simple_thread_sys.spawn(make_thread_thunk3('Thread 2',simple_thread_sys));
simple_thread_sys.start_threads();

//--- 4t Exemple (Factorial informe) ---
print(' ');
print('4th Example:');

var fact = [];
function make_fact_thunk(n, thread_system) {
  function factorial() {
    if (isFinite(n) && n>0 && n==Math.round(n)) {
    if (!(n in factorial))
    thread_system.spawn(make_fact_thunk(n-1, thread_system));
    while(fact[n-1] == undefined) {
      thread_system.relinquish();
    }
    fact[n] = n*fact[n-1];
    thread_system.quit();
    }
    else {
    fact[0] = 1;
    thread_system.quit();
    }
  };
  return factorial;
}
    
var fact_threads = make_thread_system();
fact_threads.spawn(make_fact_thunk(5, fact_threads));
fact_threads.start_threads();
print("fact ", fact[5]);


