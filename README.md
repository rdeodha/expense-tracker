# Expense Tracker

Expense Tracker is an app designed to help you manage your expenses effectively. With its seamless integration with Google Drive, it provides a convenient and secure way to track and organize your financial transactions. Whether you are an individual looking to keep personal expenses in check or a business professional aiming to track business-related costs, Expense Tracker is the perfect tool for you.

## Features/Upcoming Features

- **Google Drive Integration:** Expense Tracker integrates with your Google Drive account, allowing you to store and access your expense data securely in the cloud. You can sign in with your Google account and authorize the app to access your Drive.

- **Expense Logging:** Easily record your expenses on the go. Expense Tracker provides a user-friendly interface for adding details such as the expense amount, category, date, and optional notes.

- **Categories and Tags:** Categorize your expenses for better organization and analysis. You can create custom categories and assign tags to expenses to classify them based on your specific needs.

- **Real-time Updates:** All your expense data is synchronized with Google Drive in real time. You can access and update your expenses across multiple devices seamlessly.

- **Search and Filtering:** Find specific expenses quickly using the search and filtering functionality. Search by date, category, amount, or keywords to retrieve the expenses you need.

- **Reports and Analytics:** Get insights into your spending patterns with comprehensive reports and analytics. Expense Tracker generates visual charts and graphs to help you understand your financial habits better.

- **Budgeting Tools:** Set budget limits and track your progress effortlessly. Expense Tracker provides tools to define monthly, weekly, or custom budgets, and alerts you when you approach or exceed your set limits.

- **Data Security:** Your data is encrypted and securely stored in your Google Drive account. Expense Tracker does not have access to your financial information.

## Getting Started

This app is meant to be self-hosted. Perhaps in the future, I will create a mobile app or have hosted website. That being said, for now, if you want to use this app there are a few steps required to properly get google OAuth working.

1. Clone this repo onto the device you want to host this app.
2. Go to the [Google Cloud Console](https://console.cloud.google.com) and login any Google account.
3. Create a new project, and name it whatever you want. An easy name would be "expense-tracker".
4. Go to "APIs & Services". On the side bar click on OAuth concent screen. Under "User Type" click on "External" then click "Create".
5. Under the "App Name" give it any name, perferable "expense-tracker". Enter your Google email as a "User support email". Under "Developer contact information" enter your email again. At the bottom click "SAVE AND CONTINUE" until you see the message "BACK TO DASHBOARD".
6. 



## Support and Feedback

If you encounter any issues or have suggestions for improving Expense Tracker, please create a issue on this repo. I value your feedback and am committed to continuously enhancing the app to meet your needs.

## Privacy Policy

Expense Tracker respects your privacy and takes data security seriously. The app only accesses and stores data necessary for providing its core functionality. For detailed information about data collection, storage, and usage, please refer to our privacy policy on the Expense Tracker website.

## License

Expense Tracker is licensed under the [MIT License](https://github.com/rdeodha/expense-tracker/blob/main/LICENSE.txt). You are free to use, modify, and distribute the app in accordance with the terms specified in the license.

## Acknowledgments

Expense Tracker is built with the support of various open-source libraries and frameworks. We extend our gratitude to the developers and contributors of these projects for their valuable work.

- [Google Drive API](https://developers.google.com/drive)
- [Material UI](https://mui.com/)
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)

Thank you for using Expense Tracker! I hope it helps you take control of your expenses and achieve your financial goals.
