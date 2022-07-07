<template>
    <div class="fuzzy-search">
        <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="输入关键字"
            :remote-method="remoteMethod"
            :loading="loading"
            @clear="clear"
            @compositionupdate="compositionupdate"
        >
            <el-option
                v-for="item in data"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>

        <div>选择的关键字：{{value || '-'}}</div>
    </div>
</template>

<script setup>
import { ElSelect, ElOption } from 'element-plus'
// import { throttle } from 'throttle-debounce';
import axios from 'axios'
import { ref } from 'vue'

const value = ref('')
const loading = ref(false)
const data = ref([])

const fuzzySearch = keyword => {
    axios({
        method: 'get',
        url: `/search/?keyword=${keyword}`
    })
    .then(response => {
        console.log('Response: ', response)
        const { data: { result } } = response
        data.value = result.map(item => {
            return {
                value: item,
                label: item
            }
        })
    })
}

// const throttleFunc = throttle(1000, keyword => {
//     fuzzySearch(keyword)
// })

const remoteMethod = keyword => {
    if (!keyword) {
        data.value = []
        return
    }

    fuzzySearch(keyword)

    // throttleFunc(keyword)
}

const clear = () => {
    data.value = []
}

const compositionupdate = keyword => {
    fuzzySearch(keyword.data)
}

</script>

<style scoped>
.fuzzy-search {
    padding: 0 20%;
}

.fuzzy-search .el-select {
    width: 100%;
    margin-bottom: 50%;
}
</style>
