<script setup>
import { CaretSortIcon, CheckIcon } from '@radix-icons/vue'
const options = [
  {
    value: "pending"
  },
  {
    value: "accepted"
  },
  {
    value: "rejected"
  }
]

const usersStore = useMyUsersStore()
const open = ref(false)
const value = ref('')
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" role="combobox" :aria-expanded="open"
        class="w-full shadow-none border-2 border-gray-200 rounded-lg justify-between">
        <div v-if="value" class="flex w-full items-center justify-between">
          <span class="capitalize">{{options.find((option) => option.value === value)?.value}}</span>
        </div>
        <div v-else class="flex w-full items-center justify-between">
          <span>Pending</span>
        </div>
        <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem v-for="(option, i) in options" :key="i" :value="option.value" @select="(ev) => {
              if (typeof ev.detail.value === 'string') {
                usersStore.inputs.status.value = ev.detail.value
                value = ev.detail.value
              }
              open = false
            }">
              <div class="flex w-full items-center justify-between">
                <span class="capitalize">{{ option.value }}</span>
              </div>
              <CheckIcon style="margin-left: auto; height: 1rem; width: 1rem;"
                :class="value === option.value ? 'opacity-100' : 'opacity-0'" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>