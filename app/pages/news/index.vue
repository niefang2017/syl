<template>
  <section class="banner flex flex-col bg-no-repeat bg-cover bg-center w-full md:min-h-[400px] min-h-60 m-auto" :style="{'background-image': `url(${banner})`}">
    <div class="p-4 max-w-main m-auto w-full text-white text-left">
      <h1 class="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold">{{ title }}</h1>
    </div>
  </section>
  <div class="pl-4 pr-4 max-w-main m-auto box-border">
    <UBreadcrumb :links="links" class="sm:-mt-[1.8rem] mt-[1rem]" :ui="{
      divider: {
        base: 'flex-shrink-0 w-5 h-5 rtl:rotate-180 sm:text-white text-black dark:text-white sm:opacity-70',
      },
    }" >
    </UBreadcrumb>
    <nav class="mt-10 md:mt-14 flex items-center gap-6 overflow-x-auto pr-4 hide-scrollbar">
      <span
        v-for="item in years"
        :key="item"
       class="py-[0.31rem] px-[0.75rem] rounded-[1rem] whitespace-nowrap transition ease-in-out cursor-pointer hover:bg-light-gray-1 dark:hover:bg-black hover:font-bold"
       :class="{'bg-light-gray-1 font-bold dark:bg-black':curYear===item}"
       @click="handleClickTab(item)">
       {{item===999?lang[locale]['years']:item}}
      </span>
    </nav>
    <div class="grid grid-cols-1 gap-10 pb-10 md:mt-12">
      <LiveCard
        v-for="item in tableData.data"
        :item="item"
        :key="item.id"
        :isFlex="true"
        class="border-gray-200 dark:border-gray-700 border-dashed border-t pt-8"
        @clickItem="handleClickItem(item)"
        @play="handleClickItem(item)"
        >
      </LiveCard>
    </div>
    <Empty type="emptyType" v-if="tableData.total===0 && !loading" />
    <div v-if="tableData.total>pageParams.pageSize" class="flex justify-center mb-10">
      <UPagination
        v-model="pageParams.page"
        :page-count="pageParams.pageSize"
        :active-button="{ color: 'black' }"
        :total="tableData.total"
      />
    </div>
  </div>

</template>
<script setup lang="ts">
import { useDebounceFn,watchDebounced, } from '@vueuse/core';
import type { NewsItem,NewsResponseData } from '~/types/news'
import banner from '~/assets/images/banner_7.jpg'
import lang from 'locales/live'
import { fetchWithoutCookie } from 'hooks/fetch'
import { useYears } from 'hooks/ui/useYears'
const { locale } = useI18n()
const { newsApi } = useApi();
const {curYear,years,handleClickYear} = useYears()
const loading = ref(true)
const pageParams=ref({
  page:1,
  pageSize:9,
  // lang:locale.value,
  year:curYear.value === 999 ? '':curYear.value
})

const title = lang[locale.value]['links:news'];
const emptyType = ref('empty')
loading.value = true
emptyType.value = 'empty'
const {refData:tableData} = await newsApi.newsList(pageParams.value);
loading.value = false
const keywords = tableData.value?.data?.map((item:NewsItem)=>item.title).join(',')??'';
const description = tableData.value?.data?.map((item:NewsItem)=>item.summary).join(',')??'';
  useSeoMeta({
  title: title,
  keywords:keywords,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: tableData.value?.data?.[0]?.coverImg??banner,
  twitterImage: tableData.value?.data?.[0]?.coverImg??banner,
  twitterCard: 'summary_large_image',
})
defineOgImage({
  component: 'news',
  title: title,
  description: description,
  keywords:keywords
})
// 链接
const links = [
  {
    label: lang[locale.value]['links:home'],
    labelClass:'text-black dark:text-white sm:text-white',
    to: '/'
  },
  {
    label: lang[locale.value]['links:news'],
    labelClass:'text-black dark:text-white sm:text-white opacity-70',
  }
]

const handleClickTab = useDebounceFn(async(year:number)=>{
  await handleClickYear(year)
  pageParams.value.year = year === 999 ? '':year
  pageParams.value.page = 1
},300)
const handleClickItem = (item:NewsItem) => {
  navigateTo({
    path: `./news/${item.id}`,
  });
}
</script>
<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.hide-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.hide-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>
