<template>
    <div class="forbidden-page">
      <h1>403 - Forbidden</h1>
      <p>You don't have permission to access this page.</p>
      <router-link to="/">Go to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Forbidden'
  }
  </script>
  
  <style scoped>
  .forbidden-page {
    text-align: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .forbidden-page h1 {
    font-size: 3em;
    margin-bottom: 20px;
  }
  
  .forbidden-page p {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  
  .forbidden-page a {
    text-decoration: none;
    color: #42b983;
    font-weight: bold;
  }
  </style>