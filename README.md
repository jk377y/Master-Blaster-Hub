# WGU D424 Software Engineering Capstone
## **Master Blaster Hub Web Application**
Live URL: &nbsp;&nbsp;<a href="https://www.masterblasterhub.com/">Master Blaster Hub</a>

**By: James Kelly**<br>
**Student ID: 011500695**<br>
**February 25, 2026**<br>

## **1. Title and Purpose of the Application**

This application, **Master Blaster Hub Web Application**, is a full-stack web application designed to manage a service-based business from both the customer and administrator perspectives. The platform allows customers to create accounts, manage service locations, and track their job history, while administrators can oversee users, services, and system operations. Built with a React frontend and a Spring Boot backend, the application demonstrates secure authentication, role-based access control, and cloud deployment using modern development practices.

## **2. How to Operate the Application**

### **Customer Guide**

### 1. Creating an Account or Logging In
- Navigate to the homepage.<br>
- Select Sign Up to create a new account, or Login if you already have one.<br>
- Enter your email and password. New users must also provide their first and last name.<br>
- After successful authentication, you will be redirected to your personal portal.<br>

<img src="./frontend/src/assets/images/signupScreen.PNG" width="250px" height="250px" alt="signup screen"><img src="./frontend/src/assets/images/loginScreen.PNG" width="250px" height="250px" alt="login screen">
<br>

**EASY ACCESS**<br>
Feel free to use the following test credentials for quick access to the customer portal:<br>
Email: customer@masterblasterhub.com<br>
Password: password<br>

### 2. Accessing the Customer Portal<br>
Once logged in, customers can access the My Portal page.<br><br>
<img src="./frontend/src/assets/images/customerMyPortalPage.PNG" width="500px" height="500px" alt="myportal screen"><br><br>
This is the main dashboard for managing account activity. From this page, users can:<br>

- Add and manage service locations (addresses).<br>
- View current and past job requests.<br>
- Review job details, including status updates and pricing information when available.<br>

<img src="./frontend/src/assets/images/customerAddAddressPanel.PNG" width="500px" height="500px" alt="customer add address panel"><br>
<img src="./frontend/src/assets/images/customerDeleteAddressPanel.PNG" width="500px" height="100px" alt="customer delete address panel"><br>
<img src="./frontend/src/assets/images/customerRequestServicePanel.PNG" width="500px" height="100px" alt="customer request service panel"><br>
<img src="./frontend/src/assets/images/customerCheckRequestStatusPanel.PNG" width="500px" height="100px" alt="customer check status panel"><br>

### 3. Customer Responsibilities<br>
- Ensure all account information and service addresses are accurate.
- Submit service requests with correct details to avoid delays.
- Monitor job status updates and review pricing when a quote is provided.
- Maintain account security by keeping login credentials private and logging out when finished.

***Customers only have access to their own account information and cannot view or modify other users’ data.***

---

### **Admin Guide**

### 1. Logging in as an Administrator
- Navigate to the homepage.<br>
- Select Login and enter administrator credentials.<br>
- After successful authentication, administrators can access both the customer-facing features and the administrative dashboard.<br>

<img src="./frontend/src/assets/images/loginscreen2.PNG" width="250px" height="250px" alt="login screen with admin credentials"><br>
<br>

**EASY ACCESS**<br>
Feel free to use the following test credentials for quick access to the administrator portal:<br>
Email: admin@masterblasterhub.com<br>
Password: password<br>

### 2. Accessing the Admin Dashboard<br>
Once logged in, administrators can access the Admin Dashboard page.<br><br>
<img src="./frontend/src/assets/images/adminPage.PNG" width="500px" height="500px" alt="admin page"><br><br>
Administrators have access to protected routes not available to customers. From the Admin Dashboard, administrators can:<br>

- View and manage all registered users.<br>
- Review service requests across the system.<br>
- Update job statuses and generate pricing quotes when required.<br>
- Perform system-level actions, such as database reset (if authorized).<br>

<img src="./frontend/src/assets/images/adminCustomerSearchPanel.PNG" width="500px" height="500px" alt="admin customer search panel"><br>
<img src="./frontend/src/assets/images/adminServiceJobsSearchPanel.PNG" width="500px" height="250px" alt="admin service jobs search panel"><br>
<img src="./frontend/src/assets/images/adminDatabaseResetPanel.PNG" width="500px" height="100px" alt="admin database reset panel"><br>
<img src="./frontend/src/assets/images/adminReportExportFeature.PNG" width="800px" height="300px" alt="admin report export feature"><br>

### 3. Admin Responsibilities<br>
- Ensure job statuses are updated accurately and in a timely manner.
- Provide correct pricing information when generating quotes.
- Manage user accounts responsibly, including handling access control.
- Avoid performing administrative actions without proper justification, especially system-level operations.

***Administrators have elevated permissions and are responsible for maintaining the integrity and reliability of the system.***

---
















## **4. Git Repository**

The source code for this project can be found here:
<br>

[GitLab Project Repo](https://gitlab.com/wgu-gitlab-environment/student-repos/jkel829/d424-software-engineering-capstone/-/tree/working_branch?ref_type=heads)<br>
[GitHub Project Repo](https://github.com/jk377y/Master-Blaster-Hub/tree/working_branch)