const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const Database = require("better-sqlite3");
const { console } = require("inspector");
// const escpos = require("escpos");
// escpos.USB = require("escpos-usb");

let mainWindow;
let db;

let isDrawerOpen = false;

function simulateOpenCashDrawer() {
  return new Promise((resolve) => {
    console.log("Simulating opening cash drawer");
    isDrawerOpen = true;
    setTimeout(() => {
      resolve(true);
    }, 1000); // Simulate a 1-second delay
  });
}

function simulateCloseCashDrawer() {
  return new Promise((resolve) => {
    console.log("Simulating closing cash drawer");
    isDrawerOpen = false;
    setTimeout(() => {
      resolve(true);
    }, 1000); // Simulate a 1-second delay
  });
}

// function openCashDrawer() {
//   return new Promise((resolve, reject) => {
//     try {
//       const device = new escpos.USB();
//       const printer = new escpos.Printer(device);

//       device.open((error) => {
//         if (error) {
//           console.error("Error opening cash drawer:", error);
//           reject(error);
//           return;
//         }

//         printer.drawer(2).close();

//         isDrawerOpen = true;
//         resolve(true);

//         // Simulate drawer closing after 5 seconds
//         setTimeout(() => {
//           isDrawerOpen = false;
//           mainWindow.webContents.send("drawer-closed");
//         }, 5000);
//       });
//     } catch (error) {
//       console.error("Error opening cash drawer:", error);
//       reject(error);
//     }
//   });
// }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl).catch((e) => {
    console.error("Failed to load app:", e);
    // If loading fails, try to load a local HTML file as a fallback
    mainWindow.loadFile(path.join(__dirname, "error.html"));
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

function initializeDatabase() {
  try {
    const dbPath = path.join(app.getPath("userData"), "shop.sqlite");
    console.log("Database path:", dbPath);
    db = new Database(dbPath);

    const schema = `
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image_path TEXT,
            role TEXT NOT NULL DEFAULT 'employee',
            username TEXT UNIQUE,
            password TEXT
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        );

        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            sale_price REAL,
            buy_price REAL,
            employee_id INTEGER,
            sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id),
            FOREIGN KEY (employee_id) REFERENCES employees (id)
        );

        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            details TEXT NOT NULL,
            amount REAL NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS daily_summary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE UNIQUE,
            total_sales REAL DEFAULT 0,
            total_profit REAL DEFAULT 0,
            hardware_service REAL DEFAULT 0,
            software_service REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE UNIQUE,
            hardware_service REAL DEFAULT 0,
            software_service REAL DEFAULT 0
        );
        `;

    db.exec(schema);
    console.log("Database schema created successfully");

    // Check if the 'role' column exists in the employees table
    const tableInfo = db.prepare("PRAGMA table_info(employees)").all();
    const roleColumnExists = tableInfo.some((column) => column.name === "role");

    if (!roleColumnExists) {
      // Add the 'role' column to the employees table
      db.prepare(
        "ALTER TABLE employees ADD COLUMN role TEXT NOT NULL DEFAULT 'employee'"
      ).run();
      console.log("Added 'role' column to employees table");
    }

    // Check if the 'username' and 'password' columns exist in the employees table
    const usernameColumnExists = tableInfo.some(
      (column) => column.name === "username"
    );
    const passwordColumnExists = tableInfo.some(
      (column) => column.name === "password"
    );

    if (!usernameColumnExists) {
      db.prepare("ALTER TABLE employees ADD COLUMN username TEXT UNIQUE").run();
      console.log("Added 'username' column to employees table");
    }

    if (!passwordColumnExists) {
      db.prepare("ALTER TABLE employees ADD COLUMN password TEXT").run();
      console.log("Added 'password' column to employees table");
    }

    // Create initial admin user if not exists
    const adminExists = db
      .prepare("SELECT * FROM employees WHERE role = 'admin'")
      .get();
    if (!adminExists) {
      const insertAdmin = db.prepare(
        "INSERT OR IGNORE INTO employees (name, role, username, password) VALUES (?, ?, ?, ?)"
      );
      insertAdmin.run("Admin User", "admin", "admin", "admin123"); // You should use a proper password hashing method in production
      console.log("Initial admin user created");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
function setupIpcHandlers() {
  // ipcMain.handle("open-cash-drawer", async (event) => {
  //   try {
  //     await openCashDrawer();
  //     return { success: true };
  //   } catch (error) {
  //     return { success: false, error: error.message };
  //   }
  // });

  // ipcMain.handle("is-drawer-open", async (event) => {
  //   return { isOpen: isDrawerOpen };
  // });

  ipcMain.handle("open-cash-drawer", async (event) => {
    try {
      await simulateOpenCashDrawer();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("close-cash-drawer", async (event) => {
    try {
      await simulateCloseCashDrawer();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("is-drawer-open", async (event) => {
    return { isOpen: isDrawerOpen };
  });

  ipcMain.handle("fetch-products", (event, categoryId) =>
    db.prepare("SELECT * FROM products WHERE category_id = ?").all(categoryId)
  );

  ipcMain.handle("fetch-product", (event, productId) =>
    db.prepare("SELECT * FROM products WHERE id = ?").get(productId)
  );

  ipcMain.handle(
    "complete-sale",
    (event, { productId, salePrice, buyPrice }) => {
      const employeeId = 1; // TODO: Replace with actual logged-in employee's ID
      const stmt = db.prepare(
        "INSERT INTO sales (product_id, sale_price, buy_price, employee_id) VALUES (?, ?, ?, ?)"
      );
      return stmt.run(productId, salePrice, buyPrice, employeeId).changes > 0;
    }
  );

  ipcMain.handle("add-product", async (event, { name, categoryId }) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO products (name, category_id) VALUES (?, ?)"
      );
      console.log(categoryId);
      console.log(typeof categoryId);
      const info = stmt.run(name, categoryId);
      return { success: info.changes > 0 };
    } catch (error) {
      console.error("Error adding product:", error);
      return { error: "An error occurred while adding the product." };
    }
  });

  ipcMain.handle("add-expense", (event, { details, amount }) => {
    const stmt = db.prepare(
      "INSERT INTO expenses (details, amount) VALUES (?, ?)"
    );
    return stmt.run(details, amount).changes > 0;
  });

  ipcMain.handle(
    "add-service",
    async (event, { date, hardwareService, softwareService }) => {
      try {
        // Check if an entry for this date already exists
        const existingService = db
          .prepare("SELECT * FROM services WHERE date = ?")
          .get(date);

        let info;
        if (existingService) {
          // Update existing entry
          info = db
            .prepare(
              `
          UPDATE services 
          SET hardware_service = hardware_service + ?, 
              software_service = software_service + ? 
          WHERE date = ?
        `
            )
            .run(hardwareService, softwareService, date);
        } else {
          // Insert new entry
          info = db
            .prepare(
              `
          INSERT INTO services (date, hardware_service, software_service) 
          VALUES (?, ?, ?)
        `
            )
            .run(date, hardwareService, softwareService);
        }

        return { success: info.changes > 0 };
      } catch (error) {
        console.error("Error adding/updating service:", error);
        return {
          error: "An error occurred while adding/updating the service.",
        };
      }
    }
  );

  ipcMain.handle("fetch-report", () =>
    db.prepare("SELECT * FROM daily_summary ORDER BY date DESC LIMIT 30").all()
  );

  ipcMain.handle("login", async (event, { username, password }) => {
    console.log("Login attempt received:", { username, password });
    try {
      const user = db
        .prepare(
          "SELECT id, name, role FROM employees WHERE username = ? AND password = ?"
        )
        .get(username, password);
      console.log("Login result:", user);
      return user ? { user } : { error: "Invalid username or password" };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An error occurred during login" };
    }
  });

  ipcMain.handle("fetch-employees", async () => {
    const employees = db
      .prepare("SELECT id, name, username, role FROM employees WHERE role != ?")
      .all("admin");

    if (employees.length === 0) {
      return {
        error:
          "No employees available. Please create an employee account first.",
      };
    }

    return { employees };
  });

  ipcMain.handle("add-employee", (event, { name, username, password }) => {
    const stmt = db.prepare(
      "INSERT INTO employees (name, username, password, role) VALUES (?, ?, ?, ?)"
    );
    return stmt.run(name, username, password, "employee").changes > 0;
  });

  ipcMain.handle("delete-employee", (event, id) => {
    const stmt = db.prepare(
      'DELETE FROM employees WHERE id = ? AND role != "admin"'
    );
    return stmt.run(id).changes > 0;
  });

  ipcMain.handle("fetch-categories", async () => {
    try {
      const categories = db.prepare("SELECT * FROM categories").all();
      if (categories.length === 0) {
        return {
          categories: [],
          message: "No categories found. Please add some categories.",
        };
      }
      return { categories };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { error: "An error occurred while fetching categories." };
    }
  });

  ipcMain.handle("add-category", async (event, { name }) => {
    try {
      const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
      const info = stmt.run(name);
      return { success: info.changes > 0 };
    } catch (error) {
      console.error("Error adding category:", error);
      return { error: "An error occurred while adding the category." };
    }
  });

  ipcMain.handle("delete-category", async (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
      const info = stmt.run(id);
      return { success: info.changes > 0 };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { error: "An error occurred while deleting the category." };
    }
  });

  ipcMain.handle("fetch-users", async () => {
    try {
      const users = db
        .prepare("SELECT id, name, username FROM employees")
        .all();
      return { users };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { error: "An error occurred while fetching users." };
    }
  });

  ipcMain.handle("create-report", async (event, date) => {
    try {
      // Check if there are any sales on the given date
      const salesCheck = db
        .prepare(
          "SELECT COUNT(*) as count FROM sales WHERE DATE(sale_date) = ?"
        )
        .get(date);

      // Check if there are any services on the given date
      const servicesCheck = db
        .prepare("SELECT COUNT(*) as count FROM services WHERE DATE(date) = ?")
        .get(date);

      if (salesCheck.count === 0 && servicesCheck.count === 0) {
        return {
          error:
            "No sales or services found for the selected date. Please enter sales and service data first.",
        };
      }

      // Fetch sales data
      const sales = db
        .prepare(
          `
        SELECT 
          p.name as productName, 
          COUNT(*) as quantity, 
          SUM(s.sale_price) as totalSale, 
          SUM(s.sale_price - s.buy_price) as totalProfit
        FROM sales s
        JOIN products p ON s.product_id = p.id
        WHERE DATE(s.sale_date) = ?
        GROUP BY s.product_id
      `
        )
        .all(date);

      // Fetch services data
      const services = db
        .prepare(
          "SELECT hardware_service, software_service FROM services WHERE DATE(date) = ?"
        )
        .get(date);

      // Fetch expenses data
      const expenses = db
        .prepare("SELECT details, amount FROM expenses WHERE DATE(date) = ?")
        .all(date);

      const totalSales = sales.reduce((sum, sale) => sum + sale.totalSale, 0);
      const totalProfit = sales.reduce(
        (sum, sale) => sum + sale.totalProfit,
        0
      );
      const totalService =
        (services?.hardware_service || 0) + (services?.software_service || 0);
      const totalExpense = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const totalAfterExpenses = totalSales - totalExpense;
      const grandTotal = totalAfterExpenses + totalService;

      return {
        sales,
        expenses,
        hardwareService: services?.hardware_service || 0,
        softwareService: services?.software_service || 0,
        totalSales,
        totalProfit,
        totalService,
        totalExpense,
        totalAfterExpenses,
        grandTotal,
      };
    } catch (error) {
      console.error("Error generating report:", error);
      return { error: "An error occurred while generating the report." };
    }
  });
}

app.on("ready", () => {
  createWindow();
  initializeDatabase();
  setupIpcHandlers();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("quit", () => {
  if (db) {
    db.close();
  }
});
