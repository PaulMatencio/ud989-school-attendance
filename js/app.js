/* STUDENT APPLICATION */

/* this application is structured  as following 
    - the Model  provides the  data structure and methods to retrieve the data 
    - the Octopus provide all the methods to be used by both Model and View   
    - The View  is broken down into     
        - the Tableview  to build the html  <table>  and one <tr> per student record
        - the rowview to build the <td> check-boxs based on the attendance days of a specific student
        - the Countview  update the number of <td> missed days of a specific student  

*/

$(function() {

    //  MODEL 
    var model = {

        studentName: ["Slappy the Frog", "Lilly the Lizard", "Paulrus the Walrus", "Gregory the Goat", "Adam the Anaconda"],

        init: function() {
            // INITIALIZE THE STUDENTS ARRAY FROM THE studentName ARRAY 
            var students = [];
            this.studentName.forEach(function(e, i) {
                students.push({
                    name: e,                                          // Name of the students
                    attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //  Array of attendance days
                    missed: 0                                         // number of missed day
                });
            });
            this.students = students;
        },

        getStudents: function() {
            // POPULATE THE  STUDENTS ARRAY FROM  LOCAL STORAGE 
            this.students = JSON.parse(localStorage.students);
        },

        putStudents: function() {
            // SAVE STUDENTS ARRAY TO LOCAL STORAGE 
            localStorage.students = JSON.stringify(this.students);
        }
    };

    // OCTOPUS 
    var octopus = {

        init: function() {
            // if the student records are not in local storage
            //   - GENERATED RANDOMLY THE ATTENDANCE DAYS FOR EACH STUDENT
            //   - SAVE STUDENTS RECORDS TO LOCAL STORAGE
            // otherwise   // READ STUDENTS RECORDS from local storage
            // initialize the HTML <tab> 
            // initialize rows based on students records value
            if (!localStorage.students) {        
                model.init();
                model.students.forEach(function(e) {
                    for (var j = 0; j <= 11; j++) {
                        e.attendance[j] = octopus.getRandom();
                    }
                });
                model.putStudents();
            } else {         
                model.getStudents();
            }
            tableview.init();   
            rowview.init();    
        },

        getRandom: function(){
            // return true if > 0.5 
            return (Math.random() >= 0.5);
        },

        getStudent: function() {
            // get all the students records
            return model.students; 
        },

        saveStudent: function() {
            // save all the students records to localstorage
            model.putStudents();
        },

        countAttend: function(student) {
            // count the number of missed days 
            // and update the missed counter 
            var count = 0;
            for (var i = 0; i <= 11; i++) {
                count = count + student.attendance[i];
            }; 
            student.missed = count;
            return count;
        }
    };

    // TABLEVIEW
    var tableview = {
        // initialize the HTML students table
        init: function() {
            this.$thead = $('thead');
            this.$tbody = $('tbody');
            this.students = octopus.getStudent();
            this.render();
        },

        render: function() {
            var $thead = this.$thead;
            var html = '<tr> <th class="name-col">Student Name</th>';
            for (var j = 0; j <= 11; j++) {
                html = html + '<th>' + (j + 1) + '</th>';
            };
            $thead.html(html);
            var html2 = "";
            var students = this.students;
            var $tbody = this.$tbody;
            students.forEach(function() {
                html2 = html2 + '<tr class="student"></tr>';
            });
            $tbody.html(html2);
        }
    };

    // ROW VIEW 
    var rowview = {
        //  initialize students attendance days based on student records
        //  initialize the check-box click function()  
        init: function() {
            var $students = $('.student');
            this.$students = $students;
            this.students = octopus.getStudent();
            $students.each(function(i, e) {

                rowview.render(i, e);

                $(this).on("click", '.attend-col', function(e) {
                    // i => row number
                    var students = rowview.students;
                    var input = $(this).find('input'); // this => the td 
                    students[i].attendance[this.id] = $(input).prop("checked");
                    // pass the student element and index to the render function()
                    var $student = $(this).parent('.student');
                    countview.render(students[i], $student);
                    octopus.saveStudent();
                });
            });
        },

        render: function(i, e) {
            // display student attendance  days
            // i is the index , e is the student <tr> element 
            var studenti = this.students[i];
            var html2 = '<td class="name-col">' + studenti.name + '</td>';
            var missed = 0;
            for (var j = 0; j <= 11; j++) {
                var att = studenti.attendance[j];
                checked = "";
                if (att) {
                    checked = 'checked="checked"';
                }
                html2 = html2 + '<td id=' + j + ' class="attend-col"><input type="checkbox"' + checked + '></td>';
                missed = missed + att;
            };
            html2 = html2 + '<td class="missed-col">' + missed + '</td>';
            $(e).html(html2);
            studenti.missed = missed;
        }


    };


    //  MISSED COUNTER  VIEW
    var countview = {
        init: function() {
            // nothing to do
        },

        render: function(student, $student) {
            // is called every time the user click a  checkbox   
            var count = octopus.countAttend(student);
            var $missedcol = $($student).find('.missed-col');
            $missedcol.html(count);

        }
    };

    octopus.init();
});