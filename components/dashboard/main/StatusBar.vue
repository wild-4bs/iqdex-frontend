<script setup>
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-icons/vue";
import { ref, computed } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const open = ref(false);
const value = ref("");
const dashboardStore = useMyDashboardStore();

const activeOptionsCount = computed(() => {
  return props.options.filter((option) => option.active);
});

async function handleSelect(option) {
  option.active = !option.active;
  dashboardStore.cases = activeOptionsCount;
  const activeCases = dashboardStore.cases
    .filter((c) => c.active)
    .map((c) => c.name);
  const casesToQueryString = activeCases.join(",");
  dashboardStore.activeCasesString = casesToQueryString;
  await dashboardStore.getUsers();
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full shadow-none justify-between"
      >
        <div
          class="flex w-full gap-3 rounded-none items-center justify-between"
        >
          <div class="status">
            <span
              class="w-[10px] h-[10px] rounded-full inline-block"
              v-for="(status, i) in options"
              :key="i"
              :style="{
                background: status.active ? status.color : 'gray',
                marginRight: '-2px',
              }"
            ></span>
          </div>
          <span
            >Status {{ activeOptionsCount.length }} / {{ options.length }}</span
          >
        </div>
        <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-[200px]">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="(option, i) in props.options"
              :key="i"
              :value="option.name"
              @select="() => handleSelect(option)"
            >
              <div class="flex w-full gap-4 items-center justify-between">
                <span
                  class="w-[13px] h-[13px] rounded-full"
                  :style="{ background: option.color }"
                ></span>
                <span class="capitalize">{{ option.name }}</span>
                <CheckIcon
                  style="margin-left: auto; height: 1rem; width: 1rem"
                  :class="option.active ? 'opacity-100' : 'opacity-0'"
                />
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
