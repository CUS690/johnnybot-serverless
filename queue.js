class Queue {
    constructor(maxSize) {
      this.queue = [];
      this.maxSize = maxSize;
    }
  
    enqueue(element) {
      if (this.queue.length === this.maxSize) {
        this.queue.shift(); // Remove the oldest element
      }
      this.queue.push(element);
    }
  
    dequeue() {
      return this.queue.shift();
    }
  
    peek() {
      return this.queue[0];
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  
    isFull() {
      return this.queue.length === this.maxSize;
    }
  
    toString() {
      return this.queue.join(' ');
    }
  }
  
  // Example usage:
  const myQueue = new Queue(6);
  
  myQueue.enqueue('a');
  myQueue.enqueue('b');
  myQueue.enqueue('c');
  myQueue.enqueue('d');
  myQueue.enqueue('e');
  myQueue.enqueue('f'); // Queue is full, 'a' is removed
  myQueue.enqueue('g'); // 'b' is removed, 'g' is added
  
  console.log(myQueue.toString()); // Output: "c d e f g"