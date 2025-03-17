<script setup>
import { CaretSortIcon, CheckIcon } from "@radix-icons/vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  defaultValue: {
    type: Object,
    required: true,
  },
});

const countriesStore = useMyCountriesStore();
const usersStore = useMyUsersStore();

const open = ref(false);
const value = ref("");
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full shadow-none border-b-2 border-gray-200 border-t-0 border-r-0 border-l-0 rounded-none justify-between"
      >
        <div v-if="value" class="flex w-full items-center justify-start gap-4">
          <img
            :src="props.options.find((option) => option.value === value)?.flag"
            class="w-[25px]"
            alt=""
          />
          <span>{{
            props.options.find((option) => option.value === value)?.value
          }}</span>
        </div>
        <div v-else class="flex w-full items-center justify-start gap-4">
          <img :src="defaultValue.flag" class="w-[25px]" alt="" />
          <span>{{ defaultValue.name }}</span>
        </div>
        <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search country..." />
        <CommandEmpty>No country found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="(option, i) in props.options"
              :key="i"
              :value="option.value"
              @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    countriesStore.currentCountry = ev.detail.value;
                    console.log(ev.detail.value);
                    usersStore.inputs.country.value = ev.detail.value;
                    value = ev.detail.value;
                  }
                  open = false;
                }
              "
            >
              <div class="flex w-full items-center justify-between">
                <img :src="option.flag" class="w-[25px]" alt="" />
                <span>{{ option.value }}</span>
              </div>
              <CheckIcon
                style="margin-left: auto; height: 1rem; width: 1rem"
                :class="value === option.value ? 'opacity-100' : 'opacity-0'"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
