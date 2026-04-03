# Finance Dashboard

A modern, responsive Finance Dashboard web application built with React and Tailwind CSS. Manage your income, expenses, and get AI-powered financial insights.

## Features

### 1. **Dashboard Overview**
- Display of Total Balance, Income, and Expenses
- Real-time trend indicators (increase/decrease)
- Beautiful stat cards with icons and visual hierarchy

### 2. **Charts & Visualization**
- **Line Chart**: Time-based income vs expenses trend (last 6 months)
- **Pie Chart**: Category-based expense distribution
- Interactive tooltips and legends

### 3. **Transactions Management**
- Complete transaction table with Date, Amount, Category, and Type
- **Search functionality**: Find transactions by description or amount
- **Advanced filtering**: Filter by type (income/expense) and category
- **Smart sorting**: Sort by date, amount (ascending/descending)
- **Visual highlights**: Large expenses (>$500) are highlighted in red
- **Color coding**: Income (green) and Expenses (red)

### 4. **Role-Based Access Control**
- **Viewer Mode**: Read-only access to dashboard and reports
- **Admin Mode**: Full control with ability to:
  - Add new transactions
  - Edit existing transactions
  - Delete transactions

### 5. **Smart Insights**
- AI-powered financial analysis
- Savings rate calculations
- Highest spending category identification
- Spending trend comparisons
- Income opportunity suggestions
- Quick financial tips

### 6. **Dark Mode**
- Smooth toggle between light and dark themes
- Theme preference is persisted in local storage
- Respects system preferences on first load

### 7. **Data Persistence**
- All transactions and preferences are saved in local storage
- Data persists across browser sessions
- Automatic sync between tabs/windows

### 8. **UI/UX Enhancements**
- Smooth animations and transitions
- Hover effects on interactive elements
- Responsive grid layout (mobile, tablet, desktop)
- Graceful empty states
- Loading indicators
- Interactive form validations

## Installation

1. **Clone or navigate to the project:**
   ```bash
   cd finance-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation and role selector
│   ├── DashboardOverview.jsx   # Summary cards
│   ├── ChartsSection.jsx       # Line and pie charts
│   ├── InsightsSection.jsx     # Financial insights
│   ├── TransactionsTable.jsx   # Transaction list with filters
│   └── TransactionForm.jsx     # Add/edit form
├── context/
│   └── FinanceContext.jsx      # Global state management
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
└── index.css                    # Global styles with Tailwind
```

## Technology Stack

- **Frontend Framework**: React 18.2
- **Styling**: Tailwind CSS 3.3
- **Charts**: Recharts 2.10
- **Icons**: Lucide React & React Icons
- **Build Tool**: Vite 5.0
- **State Management**: React Context API

## Usage

### Adding a Transaction (Admin Mode)

1. Switch to **Admin** role in the header
2. Click the **"Add Transaction"** button
3. Fill in the form:
   - Select date
   - Enter amount
   - Choose type (Income/Expense)
   - Select category
   - Enter description
4. Click **"Add Transaction"**

### Filtering Transactions

- Use the search box to find by description or amount
- Choose transaction type from the dropdown
- Select a specific category
- Sort by date or amount

### Viewing Insights

- Check the **Smart Insights** panel on the right
- View AI-powered recommendations
- Track your savings rate
- Identify spending patterns

### Switching Themes

- Click the sun/moon icon in the header to toggle dark mode
- Your preference will be remembered

## Sample Data

The dashboard comes with pre-loaded sample transactions including:
- Monthly salary
- Various expense categories (food, transport, utilities, etc.)
- Freelance income
- Entertainment and shopping expenses

This allows you to explore all features immediately without manual data entry.

## Features Breakdown

### Responsive Design
- Desktop: Full layout with side-by-side charts
- Tablet: Optimized grid layout
- Mobile: Single column layout with touch-friendly controls

### Performance
- Optimized renders with React hooks
- Efficient filtering and sorting algorithms
- Memoized calculations to prevent unnecessary re-renders

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance

## Building for Production

```bash
npm run build
```

The optimized build will be created in the `dist` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Budget goals and alerts
- Recurring transactions
- Bank account synchronization
- PDF export functionality
- Mobile app version
- Multi-user support
- Advanced analytics dashboard

## License

MIT License

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Author

Created with ❤️ for better financial management.
