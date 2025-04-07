import dotenv from 'dotenv'; 
dotenv.config();


async function main() {
    console.log("TESTE", process.env.TESTE);
}

main();
