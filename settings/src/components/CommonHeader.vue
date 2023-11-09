<template>
    <header class="header-container">
        <div class="top-nav-wrapper">
            <div class="top-nav-inner">
                <router-link class="logospon" to="/">
                    <img src="../assets/logo.svg" />
                </router-link>

                <div class="details">
                    <span> xXmyignXx </span>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup></script>

<style scoped lang="scss">
.header-container {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 999;
    transition: all 0.3s ease;

    .top-nav-wrapper {
        padding: 1rem;
        background: white;
        position: relative;

        .top-nav-inner {
            margin: 0 auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 75%;

            .logospon {
                img {
                    width: 2.5rem;
                }
            }

            .details {
                margin: 0 0 0 auto;

                span {
                    font-size: 1.5rem;
                }
            }
        }
    }
}
</style>
