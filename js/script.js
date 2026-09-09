
let allProjects = [];

//============== Typing Text on Hero Section ==============

const typingText = document.getElementById("typing-text");

const roles = [
    "UI/UX Designer",
    "Front-End Developer"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if(deleting) {
        typingText.textContent = currentRole.substring(0, charIndex);
        charIndex--;
    }
    else{
        typingText.textContent = currentRole.substring(0, charIndex);
        charIndex++;
    }

    //Finished typing
    if(!deleting && charIndex > currentRole.length) {
        deleting = true;
        setTimeout(typeEffect, 1500);
        return;
    }

    //Finished deleting
    if(deleting && charIndex < 0) {
        deleting = false;
        charIndex = 0;

        roleIndex++;

        if(roleIndex >= roles.length) {
            roleIndex = 0;
        }
        setTimeout(typeEffect, 1500);
        return;
    }

    setTimeout(typeEffect, deleting ? 120:120);
}
typeEffect();


//============== Load Projects ==============

fetch("data/projects.json")
    .then(response => response.json())
    .then(projects => {
        allProjects = projects;
        displayProjects(projects);
    })
    .catch(error => {
        console.error("Error loading projects:", error);
    });

function displayProjects(projects){
    const bscContainer = document.getElementById("bsc-projects");
    const hndContainer = document.getElementById("hnd-projects");
    const individualContainer = document.getElementById("individual-projects");

    projects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-item";

        projectCard.innerHTML = 
        `<div class="project-card">
            <img src="${project.image}" 
                alt="${project.name}" 
                class="project-card-image">

            <div class="project-card-body">
                <h5 class="project-card-title">${project.name}</h5>
            </div>
        </div>

        <div class="project-details">
            <h4 class="project-details-title h4-color">${project.name}</h4>

            <!-- Image and Video -->
            <div class="project-media">
            
            <!-- Project Image -->
            <div class="project-media-item">

                <img src="${project.image}" 
                    alt="${project.name}"
                    class="project-detail-image">
            </div>

            <!-- Project Video -->
            <div class="project-media-item">
            ${project.video ? 
                `<video class="project-detail-video" controls preload="metadata">
                    <source src="${project.video}" type="video/mp4">
                        Your browser does not support video.
                </video>`:
                
                `<div class="no-video">
                    <span>Project Video</span>
                        <small>Coming soon</small>
                </div>`
            }
        </div>
        </div>
            
            <p class="project-des">${project.description}</p>
            <p><strong>Related Programme: </strong>${project.institution || "Individual Project"}</p>
            <p><strong>Developed Year: </strong>${project.year}</p>
            <p><strong>Technologies: </strong>${project.technologies.join(", ")}</p>
            <p><strong>Tools: </strong>${project.tools.join(", ")}</p>

            <!-- Project Link -->
            ${project.link ? 
                `<div class="project-link">
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer"
                        class="project-link-button">

                            ${project.link.includes("behance.net") ? "View on Behance" : "View on GitHub"}
                    </a>
                </div>`:""}
           
        </div>`;
        
        const card = projectCard.querySelector(".project-card");
        const details = projectCard.querySelector(".project-details");

        const detailImage = projectCard.querySelector(".project-detail-image");
            detailImage.addEventListener("click",(event)=>{
                event.stopPropagation();

                const modalImage = document.getElementById("modalProjectImage");
                modalImage.src = project.image;

                const imageModal = new bootstrap.Modal(
                    document.getElementById("projectImageModal")
                );

                imageModal.show();

            });

        const detailVideo = projectCard.querySelector(".project-detail-video");
            if(detailVideo){
                detailVideo.addEventListener("click",(event)=>{
                event.stopPropagation();

                const modalVideo = document.getElementById("modalProjectVideo");
                modalVideo.src = project.video;

                const videoModal = new bootstrap.Modal(
                    document.getElementById("projectVideoModal")
                );
                videoModal.show();
                });

            }

        details.style.display = "none";
        card.addEventListener("click",() =>{
            if(details.style.display === "none"){
                details.style.display = "block";
            }
            else{
                details.style.display = "none";
            }
        });
    
        if(project.category === "academic" && project.institution === "BSc(Hons) IT"){
            bscContainer.appendChild(projectCard);
        }
        else if(project.category === "academic" && project.institution === "HNDIT"){
            hndContainer.appendChild(projectCard);
        }
        else if(project.category === "individual"){
            individualContainer.appendChild(projectCard);
        }
    });

}


//============== Load Skills Realted To Projects ==============
let activeSkill = null;

function showSkillProjects(skill){
    const skillProjectsContainer = document.getElementById("skill-projects");

    const skillButtons = document.querySelectorAll(".skill-button");

    //hide projects when click again on skill button
    if(activeSkill === skill){
        skillProjectsContainer.innerHTML = "";
        activeSkill = null;
        skillButtons.forEach(button => {
            button.classList.remove("active");
        });
        return;
    }

    //clear previous projects
    skillProjectsContainer.innerHTML = "";

    //update active skill
    activeSkill = skill;
    skillButtons.forEach(button => {
        button.classList.remove("active");

        if(button.textContent.trim() === skill){
            button.classList.add("active");
        }
    });

    //find related projects
    const relatedProjects = allProjects.filter(project => project.skills.includes(skill));

    if(relatedProjects.length === 0){
        skillProjectsContainer.innerHTML = 
        `<p class="text-center">No projects found for ${skill}.</p>`;
        return;
    }

    //display related projects
    relatedProjects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.className = "skill-project-card";
        projectCard.innerHTML = 
            `<img   src = "${project.image}" 
                    alt="${project.name}"
                    class="skill-project-image">
            <h5>${project.name}</h5>
            <p>${project.category === "academic" ? "Academic Project" : "Individual Project"}
            </p>`;

        skillProjectsContainer.appendChild(projectCard);
    });
}


//========================== Load Education ==========================
fetch("data/education.json")
    .then(response => response.json())
    .then(education => {
        displayEducation(education);
    })
    .catch(error => {
        console.error("Error loading education:", error);
    });

function displayEducation(education){
    const educationContainer = document.getElementById("education-container");

    education.forEach(item => {
        const educationItem = document.createElement("div");
        educationItem.className = "education-item";
        educationItem.innerHTML = 
            `<div class="education-dot"></div>
            <div class="education-content">
                <span class="education-year">
                    ${item.startYear} - ${item.endYear}
                </span>
                <h3>${item.qualification}</h3>
                <h4>${item.institution}</h4>
                <p>${item.status}</p>
            </div>`;
        
        educationContainer.appendChild(educationItem);
    });
}


//========================== Load Certificates ==========================
let allCertificates = [];

fetch("data/certificates.json")
    .then(response => response.json())
    .then(certificates => {
        allCertificates = certificates;
        showCertificates("IT Related");
    })

    .catch(error => {
        console.error("Error loading certficates:", error);
    });

function showCertificates(category, clickedButton){
    const certficatesContainer = document.getElementById("certificates-container");
    certficatesContainer.innerHTML = "";

    //Update active certificate button
    document.querySelectorAll(".certificate-tab").forEach(button => {
        button.classList.remove("active");

        if(button.textContent.trim() === category){
            button.classList.add("active");
        }
    });

    const filteredCertificates = allCertificates.filter(certificate => certificate.category === category);

    if(filteredCertificates.length === 0){
        certficatesContainer.innerHTML = 
            `<p class="text-center">No certificates found.</p>`;
            return;
    }
    filteredCertificates.forEach(certificate => {
        const certficateCard = document.createElement("div");
        certficateCard.className = "certificate-card";

        certficateCard.innerHTML = 
            `<img src="${certificate.image}"
            alt="${certificate.name}" class="certificate-image">
            
            <div class="certificate-content">
                <h3>${certificate.name}</h3>
                <p class="certificate-issuer">${certificate.issuer}</p>
                <p class="certification-date">Issued: ${certificate.issuedDate}</p>
            </div>`;
        
        certficatesContainer.appendChild(certficateCard);
    });
}

//================ Back to top button ================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function() {
    if(window.scrollY > 300){
        backToTop.classList.add("show");
    }
    else{
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


//================ Active Navigation ================

const navLinks = document.querySelectorAll(".portfolio-navbar  .nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function(){
        navLinks.forEach(navLink => {
            navLink.classList.remove("active");
        });

        this.classList.add("active");
    });
});

//================ Professional Experience ================
fetch("data/experience.json")
    .then(response => response.json())
    .then(experience => {
        displayExperience(experience);
    })

    .catch(error => {
        console.error("Error loading experience:", error);
    });

function displayExperience(experience){
    const experienceContainer = document.getElementById("experience-container");

    experience.forEach(item => {
        const experienceItem = document.createElement("div");
        experienceItem.className = "experience-item";
        experienceItem.innerHTML = 
            `<div class="experience-dot"></div>
            <div class="experience-content">
                <span class="experience-year">
                    ${item.startDate} - ${item.endDate}
                </span>
                <h3>${item.position}</h3>
                <h4>${item.company}</h4>
                <p>${item.duration}</p>
            </div>`;
    
    experienceItem.addEventListener("click", function(){
        showExperienceDetails(item, experienceItem);
    });

    experienceContainer.appendChild(experienceItem);
    });
}

function showExperienceDetails(item, experienceItem){

    //check if details are already open
    const existingDetails = experienceItem.nextElementSibling;

    if(existingDetails && existingDetails.classList.contains("experience-details")){
        existingDetails.remove();
        return;
    }

    const detailsCard = document.createElement("div");
    detailsCard.className = "experience-details";
    detailsCard.innerHTML =
        `<h3>Experience</h3>
        <p>${item.description}</p>
        <h4>Projects I Joined</h4>
        <div class="experience-projects">${item.projects.map(project =>
                `<div class="experience-project">
                    <h5>${project.name}</h5>
                    <p>${project.description}</p>
                </div>`).join("")}
                
                </div>
                
                <h4>Technologies</h4>
                <div class="experience-tags">
                    ${item.technologies.map(technology => 
                        `<span>${technology}</span>`).join("")}
                </div>
                
                <h4>Tools</h4>
                <div class="experience-tags">
                    ${item.tools.map(tool => 
                        `<span>${tool}</span>`).join("")}
                </div>
                
                <h4>Skills Gained</h4>
                <div class="experience-tags">
                    ${item.skills.map(skill =>
                        `<span>${skill}</span>`).join("")}
                </div>`;

    experienceItem.insertAdjacentElement("afterend", detailsCard);
}