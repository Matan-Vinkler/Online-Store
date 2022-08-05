const axios = require("axios").default;

async function test() {
    let rsp = await axios.post("http://localhost:3000/signup", "email=tiesto@gmail.com&password=tiesto123", {
        maxRedirects: 0,
        validateStatus: () => true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    console.log("POST /signup -> " + rsp.status);

    rsp = await axios.post("http://localhost:3000/login", "email=tiesto@gmail.com&password=tiesto123", {
        maxRedirects: 0,
        validateStatus: () => true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    console.log("POST /login -> " + rsp.status);

    let cookie = rsp.headers["set-cookie"][0].split("; ")[0];

    rsp = await axios.post("http://localhost:3000/cart", "productId=bbb123", {
        maxRedirects: 0,
        validateStatus: () => true,
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie
        }
    });
    console.log("POST /cart -> " + rsp.status);

    rsp = await axios.post("http://localhost:3000/checkout", "totalPrice=100&creditId=123456789012&validDate=1111-11-11&ccv=123", {
        maxRedirects: 0,
        validateStatus: () => true,
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie
        }
    });
    console.log("POST /cart -> " + rsp.status);
}

test();