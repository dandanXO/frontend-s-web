<template>
  <div class="forbidden-page">
    <div class="content">
      <h1>403</h1>
      <h2>Forbidden</h2>
      <p>Sorry, but you don't have permission to access this page.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',
}
</script>

<style scoped>
.forbidden-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('https://source.unsplash.com/random/1600x900') no-repeat
    center center;
  background-size: cover;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.content {
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
  border-radius: 10px;
  animation: fadeIn 1s ease-in-out;
}

.content h1 {
  font-size: 6em;
  margin: 0;
  color: #ff6f61;
  animation: bounce 1s infinite;
}

.content h2 {
  font-size: 2em;
  margin: 10px 0;
}

.content p {
  font-size: 1.2em;
  margin: 20px 0;
}

.content a {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  color: #fff;
  background: #ff6f61;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.content a:hover {
  background: #ff4f41;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
