const fetch = require('node-fetch');
// Node 18+ has built-in fetch.
fetch('https://api.github.com/users/Abhishek87550/repos')
  .then(res => res.json())
  .then(repos => {
    repos.forEach(repo => {
      console.log(`Name: ${repo.name}\nDescription: ${repo.description}\n`);
    });
  })
  .catch(err => console.error(err));
