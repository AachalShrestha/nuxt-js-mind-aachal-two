<template>
    <div>
        <div class="pr-5">
            <Drawer />
        </div>
        <div class="container">
            <div>
            <h1 class="text-3xl md:text-3xl lg:text-6xl lg:mb-10 font-bold"> Dashboard</h1>
            </div>
            <AllbooksArticlesTagTable /> 
            <AllbooksTagChart /> 
        </div>
    </div>
</template>

<script setup>
import AllbooksTagChart from '~/components/Charts/AllbooksTagChart.vue';
import AllbooksArticlesTagTable from '../components/Charts/AllbooksArticlesTagTable.vue'
</script>