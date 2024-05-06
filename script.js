// ? Grab references to the important DOM elements.
// const rootEl = document.getElementById("root");
const timeDisplayEl = $('#time-display');
const projectDisplayEl = $('#project-display');
const projectFormEl = $('#project-form');
const projectNameInputEl = $('#project-name-input');
const projectTypeInputEl = $('#project-type-input');
const projectDateInputEl = $('#taskDueDate');

// ? Helper function that displays the time, this is called every second in the setInterval function below.
function displayTime() {
    const rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    // titleEl.textContent = "Hello friends" below;
    timeDisplayEl.text(rightNow);
}

function readProjectsFromStorage() {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    // TODO: Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
    // if (!projects) {
    //     projects = [];
    // }
    //The above if statement can be simplified by just including it in the variable declaration line. example:  let projects = JSON.parse(localStorage.getItem('projects')); and by adding the or and [ ]   ( || [ ] ) which means is if the first part of code is "undefined" then create an empty array. Per Prof Farish exmplanation.
    return projects;
}

// TODO: Create a function that accepts an array of projects, stringifys them, and saves them in localStorage.

function saveProjectsToStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function dataToLS(projects) {
    // I got the below wrong because I did not include the "key",
    //so setItem takes in two arguments, the key and the value seperated by comma.-rs
    localStorage.setItem('projects', JSON.stringify(projects));
}

// ? Creates a project card from the information passed in `project` parameter and returns it.
function createProjectCard(project) {
    // TODO: Create a new card element and add the classes `card`, `project-card`, `draggable`, and `my-3`. Also add a `data-project-id` attribute and set it to the project id.

    // *Dynamically creates a new <div> element. JS equivalent:
    //const taskCard = document.createElement('div'); // below is jquery equivalent
    const taskCard = $('div')
        .addClass('card project-card draggable my-3')
        .attr('data-project-id', project.id);
    // Note the following javaScript lines are written differently but do exactly the same:
    // taskCard.setAttribute('class', 'titleElClass');
    // taskCard.className = 'titleElClass';
    // ***********Super  important -> However, it's important to note that both of these methods will overwrite any existing classes on the element. If you want to add a class while preserving existing ones, you should use the classList.add method in JavaScript or the addClass method in jQuery.

    //Note: Super important, what are javaScript differences  between the below 3 ???
    // "  titleEl.setAttribute('class', 'titleElClass')"";
    // "  titleEl.className = 'titleElClass'  "
    // "  titleEl.classList.add('titleElClass')  "

    // Answer: They are all javaScript and the first two do exactly the same thing of
    // adding a class called titleElClass to the <h1> element. *Both do the same just
    // written differently. ***However, it's important to note that both of these methods will "overwrite" any existing classes on the element. If you want to add a class while preserving existing ones, you should use the "classList.add" method in JavaScript or the addClass method in jQuery.

    // TODO: Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
    const cardHeader = $('<div>').addClass('card-header h4').text(project.name);

    // TODO: Create a new card body element and add the class `card-body`.
    const cardBody = $('<div>').addClass('card-body');

    // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project type.
    const cardDescription = $('<p>').addClass('card-text').text(project.type);

    // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
    const cardDueDate = $('<p>').addClass('card-text').text(project.dueDate);

    // TODO: Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-project-id` attribute and set it to the project id.
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-project-id', project.id);

    // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (project.dueDate && project.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');

        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // TODO: Append the card description, card due date, and card delete button to the card body.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);

    // TODO: Append the card header and card body to the card.
    taskCard.append(cardHeader, cardBody);
    // ? Return the card so it can be appended to the correct lane.
    return taskCard;
}

function printProjectData() {
    const projects = readProjectsFromStorage();

    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards'); // Binding to html element : first of the three columns to do/in progress/ done
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    // TODO: Loop through projects and create project cards for each status
    // [ ]  Understand let of ???
    for (let project of projects) {
        if (project.status === 'to-do') {
            todoList.append(createProjectCard(project)); //createProjectCard(project) *returns:a div element called taskCard
        } else if (project.status === 'in-progress') {
            inProgressList.append(createProjectCard(project));
        } else if (project.status === 'done') {
            doneList.append(createProjectCard(project));
        }
    }

    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// ? Removes a project from local storage and prints the project data back to the page
function handleDeleteProject() {
    const projectId = $(this).attr('data-project-id'); //This line is using jQuery to get the value of the data-project-id attribute from the HTML element that the current function (handleDeleteProject) is being called on. In jQuery, $(this) refers to the current element. The .attr('data-project-id') function is a jQuery method that gets the value of an attribute from the selected elements. In this case, it's getting the value of the data-project-id attribute.

    //************************************

    // Note: // So, line 22 is using .attr() for setting an attribute, and line 23 is using .attr() for getting an attribute. see below:

    // 22 . quoteEl.attr('class', 'fancy');
    // 23 . const projectId = $(this).attr('data-project-id');

    // in JQuery so .attr is interchangable to setting and getting , in this case depending on the number of arguments.

    //

    const projects = readProjectsFromStorage();

    // TODO: Loop through the projects array and remove the project with the matching id.
    projects.forEach((project) => {
        if (project.id === projectId) {
            projects.splice(projects.indexOf(project), 1);
        }
    });
    // ? We will use our helper function to save the projects to localStorage
    saveProjectsToStorage(projects);

    // ? Here we use our other function to print projects back to the screen
    printProjectData();
}

// ? Adds a project to local storage and prints the project data

//--------------------------------------------------------
//------------------------------------------------------- Farish ends explanation  here

function handleProjectFormSubmit(event) {
    event.preventDefault();

    // TODO: Get the project name, type, and due date from the form
    const projectName = projectNameInputEl.val(); // ".val()" isused in JQuery while VanillaJS would be ".value"
    const projectType = projectTypeInputEl.val();
    const projectDate = projectDateInputEl.val();

    // const projectName = $(this).attr('projectNameInputEl');  // Note, these three lines of code did not work and return "undefined" , reason: this is to get value by accessing it's "attribute" (hence: .attr (one argument is to get while two arguments are to set in .attr)), in this case we are accessing element by id.
    // const projectType = $(this).attr('projectTypeInputEl');
    // const projectDate = $(this).attr('projectDateInputEl');

    console.log(
        'here are variables which have element input values saved to them: projectName, ProjectType, and projectDate : ',
        projectName,
        projectType,
        projectDate
    );

    // ? Create a new project object with the data from the form
    const newProject = {
        // ? Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
        id: crypto.randomUUID(),
        name: projectName,
        type: projectType,
        dueDate: projectDate,
        status: 'to-do',
    };

    console.log('newPorject is: ', newProject);

    // ? Pull the projects from localStorage and push the new project to the array
    const projects = readProjectsFromStorage();
    projects.push(newProject);

    // ? Save the updated projects array to localStorage
    saveProjectsToStorage(projects);

    // ? Print project data back to the screen
    printProjectData();

    // TODO: Clear the form inputs
    projectNameInputEl.val('');
    projectTypeInputEl.val('');
    projectDateInputEl.val('');
}

// ? This function is called when a card is dropped into a lane. It updates the status of the project and saves it to localStorage. You can see this function is called in the `droppable` method below.
function handleDrop(event, ui) {
    // ? Read projects from localStorage
    const projects = readProjectsFromStorage();

    // ? Get the project id from the event
    const taskId = ui.draggable[0].dataset.projectId;

    // ? Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;

    for (let project of projects) {
        // ? Find the project card by the `id` and update the project status.
        if (project.id === taskId) {
            project.status = newStatus;
        }
    }
    // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
    localStorage.setItem('projects', JSON.stringify(projects));
    printProjectData();
}

// ? Add event listener to the form element, listen for a submit event, and call the `handleProjectFormSubmit` function.
projectFormEl.on('submit', handleProjectFormSubmit);

// TODO: Add an event listener to listen for the delete buttons. Use event delegation to call the `handleDeleteProject` function.

//

projectDisplayEl.on('click', '.btn-delete-project', handleDeleteProject);

// ? Call the `displayTime` function once on page load and then every second after that.
displayTime();
setInterval(displayTime, 1000);

// ? When the document is ready, print the project data to the screen and make the lanes droppable. Also, initialize the date picker.
$(document).ready(function () {
    // ? Print project data to the screen on page load if there is any
    printProjectData();

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    // ? Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});
