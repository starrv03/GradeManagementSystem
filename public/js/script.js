function init(){

    //DEV URL
    //const BASE_URL=`http://localhost:3000`;
    //PRODUCTION URL
    const BASE_URL=`.`;
    let projectName="";
    let records=[];
    let metadata={} 

    document.getElementById("add-new-record-form").addEventListener("submit",addNewRecord);


    async function getData(){
        let resp=await fetch(`${BASE_URL}/projectName`);
        projectName=await resp.text();
        resp=await fetch(`${BASE_URL}/records`);
        if(resp.ok){
            records=await resp.json();
            resp=await fetch(`${BASE_URL}/metadata`);
            metadata=await resp.json();
            renderContent();
        }
        else{
            alert("Error loading data");
        }
    }

    function renderContent(){
        const mainHeading=document.getElementById("title");
        mainHeading.textContent=projectName;
        records.forEach(record => displayRecord(record));
    }

    function displayRecord(record){
        const section=document.getElementsByTagName("main")[0].firstElementChild;
        const div=document.createElement("div");
        div.classList.add("col");
        const article=document.createElement("article");
        article.id=`article-${record.id}`;
        const button=document.createElement("button");
        button.textContent="x";
        button.classList.add("delete");
        button.addEventListener("click",deleteRecord);
        article.append(button);
        const name=document.createElement("p");
        name.textContent=record.name;
        name.classList.add("name");
        article.append(name);
        const course=document.createElement("p");
        course.textContent=`Course: ${record.course}`;
        article.append(course);
        const attendance=document.createElement("p");
        attendance.textContent=`Attendance: ${record.attendance}%`;
        article.append(attendance);
        const more=document.createElement("p");
        more.classList.add("more-info");
        more.textContent="more info";
        more.addEventListener("click",toggleMoreInfo);
        article.append(more);
        const gradesDiv=document.createElement("div");
        gradesDiv.classList.add("grades-div");
        const gradeHeading=document.createElement("p");
        gradeHeading.classList.add("grades-heading");
        gradeHeading.textContent="Grades";
        gradesDiv.append(gradeHeading);
        const ul=document.createElement("ul");
        record.grades.forEach(grade=>{
            const li=document.createElement("li");
            li.textContent=`${grade}%`;
            ul.append(li);
        });
        gradesDiv.append(ul);
        const form=document.createElement("form");
        form.id="add-new-grade-form";
        form.addEventListener("submit",updateGrades);
        let newGradeDiv=document.createElement("div");
        const label=document.createElement("label");
        label.setAttribute("for","new-grade");
        label.textContent="Update Grades";
        newGradeDiv.append(label);
        const input=document.createElement("input");
        input.type="text";
        input.id="new-grade";
        input.name="new-grade";
        input.pattern="^\\d+(,{1}\\d+)*";
        input.title="grades must be comma seperated numbers";
        input.required=true;
        newGradeDiv.append(input);
        form.append(newGradeDiv);
        newGradeDiv=document.createElement("div");
        const submit=document.createElement("input");
        submit.type="submit";
        submit.id="submit-new-grade";
        submit.name="submit-new-grade";
        submit.value="update grades";
        newGradeDiv.append(submit);
        form.append(newGradeDiv);
        gradesDiv.append(form);
        article.append(gradesDiv);
        div.append(article);
        section.getElementsByClassName("row")[0].append(div);
    }

    function toggleMoreInfo(e){
        const target=e.target;
        const parent=target.parentElement;
        const gradesDiv=parent.getElementsByClassName("grades-div")[0];
        const display=window.getComputedStyle(gradesDiv).getPropertyValue("display");
        if(display==="none"){
            const moreInfo=parent.getElementsByClassName("more-info")[0];
            moreInfo.textContent="hide info";
            gradesDiv.style.display="block";
        }
        else{
            const moreInfo=parent.getElementsByClassName("more-info")[0];
            moreInfo.textContent="more info";
            gradesDiv.style.display="none";
        }
    }

      async function addNewRecord(e){
        e.preventDefault();
        const form=e.target;
        const grades=form.grades.value;
        const regex=/^\d+(,{1}\d+)*/;
        const match=regex.test(grades);
        if(!match) {
            alert("Grades must be comma seperated integers");
            return;
        }
        let gradesList=form.grades.value.split(",");
        gradesList=gradesList.map(grade=>parseFloat(grade));
        const data={name:form.name.value, course:form.course.value, grades:gradesList, attendance:parseFloat(form.attendance.value), status:form.status.value};
        const resp=await fetch(`${BASE_URL}/records`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
       });
       const result=await resp.json();
       if(resp.ok){
        displayRecord(result);
       }
       else{
        alert(result);
       }
    }

    async function deleteRecord(e){
        const parent=e.target.parentElement;
        const id=parent.id.split("-")[1];
        const resp=await fetch(`${BASE_URL}/records/${id}`,{
            method: "DELETE",
        });
        console.log("response",resp);
        if(resp.ok){
            parent.remove();
        }
        else{
             alert(result);
        }
    }

    async function updateGrades(e){
        e.preventDefault();
        let grades=e.target["new-grade"].value.split(",");
        grades=grades.map(grade=>parseFloat(grade));
        const data={grades};
        const parent=e.target.parentElement.parentElement;
        const id=parent.id.split("-")[1];
        const resp=await fetch(`${BASE_URL}/records/${id}`,{
            method: "PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        const result=await resp.json();
        if(resp.ok){
            const updatedGrades=result.grades;
            const gradesList=parent.getElementsByTagName('ul')[0];
            while(gradesList.firstChild){
                gradesList.firstChild.remove();
            }
            updatedGrades.forEach(grade=>{
                const li=document.createElement("li");
                li.textContent=`${grade}%`;
                gradesList.append(li);
            });
        }
        else{
            alert(result);
        }
    }

    getData(); 
}

init();


