"use strict"

class Post {

    constructor(title, content, category, topic, date) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.topic = topic;
        this.date = new Intl.DateTimeFormat('en-US').format(new Date());
    }

    insert() {
        
    }
}