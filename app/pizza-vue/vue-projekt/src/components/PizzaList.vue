<script setup>
import { ref, onMounted } from "vue";

const pizze = ref([]);

onMounted(async () => {
  const response = await fetch("http://localhost:3000/pizze");
  pizze.value = await response.json();
  console.log(pizze.value);
});

</script>

<template>
  

    <div v-for="pizza in pizze" :key="pizza.id">
        <div class="bg-inherit rounded-xl overflow-hidden">
            <div class="w-full h-48 flex items-center justify-center bg-white">
            <!-- Slika s interneta -->
                <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image1" class="w-full h-full object-contain" />
            </div>
            <div class="p-6">
                <div class="flex items-center space-x-3 mb-4">
                <!-- Naziv -->
                    <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>
                <!-- Sastojci -->
                    <div class="flex space-x-2">
                        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-
                        center text-slate-50 font-semibold text-xs">Icon</div>

                        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-
                        center text-slate-50 font-semibold text-xs">Icon</div>

                        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-
                        center text-slate-50 font-semibold text-xs">Icon</div>
                    </div>
                </div>
            <!-- Cijene za svaku veličinu -->
                <div class="space-y-2">
                    <div class="flex justify-between text-gray-700">
                        <span class="font-medium">Mala</span>
                        <span>€ + {{ pizza.cijene?.mala }}</span>
                    </div>
                    <div class="flex justify-between text-gray-700">
                        <span class="font-medium">Srednja</span>
                        <span>€ + {{ pizza.cijene?.srednja }}</span>
                    </div>
                    <div class="flex justify-between text-gray-700">
                        <span class="font-medium">Jumbo</span>
                        <span>€ + {{ pizza.cijene?.jumbo }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<style>
/* Stilovi komponente (CSS) */
</style>