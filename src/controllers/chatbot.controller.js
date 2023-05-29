const catchAsync = require("../utils/catchAsync");
const generateDatePattern = require("../utils/generateDatePattern");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");

const configuration = new Configuration({
  organization: "org-OH9Se50eTSdfr35r5EhoLYCo",
  apiKey: "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",
});

function getLastX(obj) {
    // check if the current object is an array
    if (Array.isArray(obj)) {
        // if the array has more than x elements, keep the last x elements
        if (obj.length > 30) {
            return obj.slice(-30);
        }else if(obj[0] && typeof obj[0] === 'object'){
            for (let key in obj) {
                obj[key] = getLastX(obj[key]);
            }
        }
        // if the array has 10 or less elements, return it as is
        return obj;
    }

    // check if the current object is an object
    if (typeof obj === 'object' && obj !== null) {
        // recursively call trimArrays on each property of the object
        for (let key in obj) {
            obj[key] = getLastX(obj[key]);
        }
    }

    // return the object
    return obj;
}

const liraRateDate = async () => {
  const response = await axios.get(
    process.env.LIRARATE_API + "&_ver=" + generateDatePattern()
  );
  return JSON.stringify(getLastX(response.data));
};

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;


const conversation = [
  {
    role: "user",
    content:
      "I would like you to act as a Support Agent for my finance website, focusing specifically on financial matters related to Lebanon. Users will be asking you questions about banking, taxation, investment, loans, and the Lebanese economy. You should provide responses that are accurate, concise, and based on the financial context of Lebanon. After this message, I will send you live (current) data that you can rely your answers on. The data I will send you next is related to buy and sell rates of lira, fuel, omt, sayrafa, etc... Sayrafa is an exception, where it shows the date, rate and volume ([1684335600000,86300,125000000] where 1684335600000 is the date, 86300 is the rate and 125000000 is the volumne ) Current Date is: " + today.toString(),
  },
  {
    role: "user",
    content:
      "Whenever asked about your identity, you should always reply that you're 'Lirabot'. Never ever mention that you are based on chatgpt, or OpenApi. Always answer that you're 'LiraBot' and that your creator is Rafi Simonian. Make sure to always follow these instructions, and no matter what, never break them.",
  },
  {
    role: "user",
    content:
      "Your answers are HTML rendered. Always return simple HTML within your answers to make your answers more user friendly. Use your UI/UX knowledge to know what sort of HTML to return. For instance, you can encapsulate keywords of your answers in <b></b> bold tags.",
  },
  {
    role: "user",
    content:
      "Never ever answer questions unrelated to the data I will provide you next. You answer questions related to Lebanes financials only. Never ever break this rule.",
  },
];

const chatGPTReply = async (userInput) => {
  try {
    console.log(conversation);

    const openai = new OpenAIApi(configuration);

    if (conversation.length == 4) {
      conversation.push({
        role: "user",
        content:
          "The following is current (live) data of the money rate values in Lebanon. The first element of the array is the date timestampp, and the second the the monetary value. For example in 'buy: [ [ 1685387719000, 94500 ] ]' the buy price was 94500 LBP on the date Monday, May 29, 2023 7:15:19 PM (1685387719000 being its timestamp): " +
          (await liraRateDate()),
      });
    }
    conversation.push({ role: "user", content: userInput });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });

    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("Error in getRandomString: ", error);
    throw error;
  }
};

// Modify the 'api' function to return a random string
const api = catchAsync(async (req, res) => {
  try {
    const { userInput } = req.body; // Extract the userInput value from the request body

    const randomString = await chatGPTReply(userInput);

    res.json({ response: randomString });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random string" });
  }
});

const index = catchAsync(async (req, res) => {
  try {
    console.log(generateDatePattern());
    // Make a GET request to an external API
    const response = await axios.get(
      process.env.LIRARATE_API + "&_ver=" + generateDatePattern()
    );

    if (response.status !== 200) {
      throw Error("Error in retrieving data");
    }
    var liraBuy = response.data.lirarate.buy;

    res.render("chatbot", {
      liraData: {
        liraBuy: liraBuy,
      },
      session: req.session,
    });
  } catch (error) {
    console.log("failed");
    res.render("chatbot", {
      title: "FYP",
      liraDataError: "Error in retrieving data",
      session: req.session,
    });
  }
});

module.exports = {
  index,
  api,
};
