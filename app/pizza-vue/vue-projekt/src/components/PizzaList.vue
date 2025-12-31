<script setup>
import { ref, onMounted } from "vue";

const pizze = ref([]);
const odabrana_pizza = ref(null);
const velicina_pizza = ref(null);
const selectedNumber = ref(null);
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3000/pizze");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    pizze.value = data;
    console.log("Podaci o pizzama:", pizze.value);
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka o pizzama:", error);
  }
});

function odaberiPizzu(pizza_naziv, pizza_velicina) {
  odabrana_pizza.value = pizza_naziv;
  velicina_pizza.value = pizza_velicina;
  console.log(
    "Odabrana pizza:",
    odabrana_pizza.value,
    "Velicina pizze:",
    velicina_pizza.value
  );
}
</script>

<template>
  <body>
    <div class="mx-auto bg-linear-to-br min-h-screen p-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Pizza 1 -->
             
            <div v-for="pizza in pizze" :key="pizza.id" class="bg-inherit rounded-xl overflow-hidden">
                <div :class="['bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',odabrana_pizza === pizza.naziv? 'border-5 border-orange-600 shadow-lg shadow-orange-300/50 scale-[1.10]': 'hover:scale-[1.06]' ,]">
                    <div class="w-full h-48 flex items-center justify-center bg-inherit">
                        <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image 1" class="w-full h-full object-contain" />
                    </div>

                      <div class="p-6">
                          <div class="flex items-center space-x-3 mb-4">
                              <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

                              <div class="flex space-x-2">
                                  <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                                  <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                                  <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                              </div>
                          </div>
                          <div class="space-y-2">
                            <div v-for="vel in ['mala','srednja','jumbo']" :key="vel" class="flex justify-between text-gray-700 space-y-2">
                              <span class="font-medium">{{ vel.charAt(0).toUpperCase() + vel.slice(1) }}</span>
                              <span>€{{ pizza.cijene[vel] }}</span>
                              
                              <button @click="odaberiPizzu(pizza.naziv, vel)">Dodaj pizzu</button>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>

    </div>
</body>
</template>


<style>
/* Stilovi komponente (CSS) */
</style>