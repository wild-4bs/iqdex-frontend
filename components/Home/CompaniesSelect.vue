<script setup>
import { CaretSortIcon, CheckIcon } from "@radix-icons/vue";

const onScrollEnd = (
  element,
  callback,
  direction = "vertical",
  threshold = 10
) => {
  element.addEventListener("scroll", () => {
    const isEnd =
      direction === "vertical"
        ? element.scrollHeight - element.scrollTop - threshold <=
          element.clientHeight
        : element.scrollWidth - element.scrollLeft - threshold <=
          element.clientWidth;

    if (isEnd) {
      callback();
    }
  });
};

const props = defineProps({
  error: {
    type: Boolean,
    required: false,
  },
});
const companiesStore = useMyCompaniesStore();
const inputsStore = useMyInputsStore();
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
        :class="[
          'flex-1 h-full translate-y-1 shadow-none border-b-2 border-gray-200 border-t-0 border-r-0 border-l-0 rounded-none justify-between',
          error ? 'border-b-red-500 text-red-500' : '',
        ]"
      >
        <div v-if="value" class="flex w-full items-center justify-start gap-4">
          <span class="capitalize">{{
            companiesStore.companies.find((company) => company.name === value)
              ?.name
          }}</span>
        </div>
        <div v-else class="flex w-full items-center justify-start gap-4">
          <span>Select your company</span>
        </div>
        <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search company..." />
        <CommandEmpty>No Companies.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              :class="
                company.userCount >= company.users_limit
                  ? 'cursor-not-allowed bg-red-5'
                  : ''
              "
              v-for="(company, i) in companiesStore.companies"
              :key="i"
              :value="company.name"
              @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    companiesStore.selectedCompany =
                      companiesStore.companies.find(
                        (company) => company.name == ev.detail.value
                      );
                    if (company.userCount < company.users_limit) {
                      console.log(inputsStore.companyName);
                      value = ev.detail.value;
                    } else {
                      return;
                    }
                  }
                  open = false;
                }
              "
            >
              <div
                class="flex w-full items-center justify-between cursor-pointer"
                :class="
                  company.userCount >= company.users_limit
                    ? 'cursor-not-allowed'
                    : ''
                "
              >
                <span class="capitalize pointer-events-none">{{
                  company.name
                }}</span>
                <span class="text-xs text-gray-600 pointer-events-none"
                  >{{ company.userCount }}/{{ company.users_limit }}</span
                >
              </div>
              <CheckIcon
                style="margin-left: auto; height: 1rem; width: 1rem"
                :class="value === company.name ? 'opacity-100' : 'opacity-0'"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
