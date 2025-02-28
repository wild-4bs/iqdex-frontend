<script setup>
import { CaretSortIcon, CheckIcon } from '@radix-icons/vue'

const props = defineProps({
  id: String,
  name: String
})

const emit = defineEmits(['select-company'])

const open = ref(false)
const value = ref('')
const companiesStore = useMyCompaniesStore()
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" role="combobox" :aria-expanded="open"
        class="w-full shadow-none border-[1px] border-gray-200 rounded-none justify-between">
        <div v-if="value" class="flex w-full items-center justify-between">
          <span class="capitalize">{{companiesStore.companies.find((company) => company.name === value)?.name}}</span>
        </div>
        <div v-else class="flex w-full items-center justify-between">
          <span class="capitalize">{{companiesStore.companies.find(com => com.id == props.id)?.name}}</span>
        </div>
        <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-[240px]">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem v-for="(company, i) in companiesStore.companies" :key="i" :value="company.name" @select="(ev) => {
              if (typeof ev.detail.value === 'string') {
                value = ev.detail.value
                const selectedComp = companiesStore.companies.find((com) => com.name == ev.detail.value)
                emit('select-company', selectedComp)
              }
              open = false
            }">
              <div class="flex w-full items-center justify-between">
                <span class="capitalize">{{ company.name }}</span>
                <span class="capitalize">{{ company.users.length }}/{{ company.users_limit }}</span>
              </div>
              <CheckIcon style="margin-left: auto; height: 1rem; width: 1rem;"
                :class="value === company.name ? 'opacity-100' : 'opacity-0'" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>