
const { adams } = require("../Ibrahim/adams");
const { getBalance, getServices, addOrder, getOrderStatus } = require("../Ibrahim/api/yoyomedia");

adams({
  nomCom: "smcmds",
  categorie: "Social",
  reaction: "📱"
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  
  const smCommands = `
╔════════════════════╗
     *SOCIAL MEDIA COMMANDS*
╚════════════════════╝

┌────────────────
│ *📊 SERVICES*
│ .smbalance : Check your account balance
│ .smservices : List all available services
│ .smorder : Place a new service order
│ .smstatus : Check order status
└────────────────

Note: Some commands are restricted to admin/owner use only.
`;

  repondre(smCommands);
});

adams({
  nomCom: "smbalance",
  categorie: "Social",
  reaction: "💰"
}, async (dest, zk, commandeOptions) => {
  const { repondre, superUser } = commandeOptions;
  
  if (!superUser) {
    repondre('This command is only for the bot owner');
    return;
  }

  try {
    const balance = await getBalance();
    repondre(`Balance: ${balance.balance} ${balance.currency}`);
  } catch (error) {
    repondre("Error checking balance: " + error.message);
  }
});

adams({
  nomCom: "smservices", 
  categorie: "Social",
  reaction: "📋"
}, async (dest, zk, commandeOptions) => {
  const { repondre, superUser } = commandeOptions;

  if (!superUser) {
    repondre('This command is only for the bot owner');
    return;
  }

  try {
    const services = await getServices();
    let message = "Available Services:\n\n";
    services.forEach(service => {
      message += `*${service.name}*\n`;
      message += `ID: ${service.service}\n`;
      message += `Rate: ${service.rate}\n`;
      message += `Min: ${service.min}\n`;
      message += `Max: ${service.max}\n\n`;
    });
    repondre(message);
  } catch (error) {
    repondre("Error fetching services: " + error.message);
  }
});

adams({
  nomCom: "smorder",
  categorie: "Social", 
  reaction: "🛒"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, superUser } = commandeOptions;

  if (!superUser) {
    repondre('This command is only for the bot owner');
    return;
  }

  if (arg.length < 3) {
    return repondre("Usage: .smorder <service_id> <link> <quantity>");
  }
  
  try {
    const [serviceId, link, quantity] = arg;
    const order = await addOrder(serviceId, link, parseInt(quantity));
    repondre(`Order placed successfully! Order ID: ${order.order}`);
  } catch (error) {
    repondre("Error placing order: " + error.message);
  }
});

adams({
  nomCom: "smstatus",
  categorie: "Social",
  reaction: "📊"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, superUser } = commandeOptions;

  if (!superUser) {
    repondre('This command is only for the bot owner');
    return;
  }

  if (!arg[0]) {
    return repondre("Please provide an order ID");
  }

  try {
    const status = await getOrderStatus(arg[0]);
    let message = "*Order Status*\n\n";
    message += `Status: ${status.status}\n`;
    message += `Charge: ${status.charge} ${status.currency}\n`;
    message += `Start Count: ${status.start_count}\n`;
    message += `Remains: ${status.remains}`;
    repondre(message);
  } catch (error) {
    repondre("Error checking status: " + error.message);
  }
});
