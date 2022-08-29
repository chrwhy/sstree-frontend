<template>
    <div class="fuzzy-search" @keydown="keydown">
        <div class="fuzzy-search__type">
            <el-select v-model="type" placeholder="请选择">
                <el-option
                    v-for="(item, index) in options"
                    :key="index.toString()"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
            </el-select>
        </div>
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
            @change="change"
            @compositionupdate="compositionupdate"
        >
            <el-option
                v-for="item in data"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </div>
    <div>选择的关键字：{{ value || '-' }}</div>
</template>

<script setup>
import { ElSelect, ElOption } from 'element-plus'
// import { throttle } from 'throttle-debounce';
import axios from 'axios'
import { ref } from 'vue'

const value = ref('')
const loading = ref(false)
const data = ref([])
let isSelectAll = false
const options = [
    {
        label: '表格',
        value: 'excel',
    },
    {
        value: 'ppt',
        label: '演示',
    },
]
const type = ref('')

let cacheKeyword = ''

const fuzzySearch = (keyword) => {
    let url = `/search/${keyword}`
    if (type.value) url = `${url}?cate=${type.value}`
    axios({
        method: 'get',
        url,
    }).then((response) => {
        console.log('Response: ', response)
        const {
            data: { result },
        } = response
        data.value = result.map((item) => {
            return {
                value: item,
                label: item,
            }
        })
    })
}

// const throttleFunc = throttle(1000, keyword => {
//     fuzzySearch(keyword)
// })

const remoteMethod = keyword => {
    cacheKeyword = keyword
    if (!keyword) {
        data.value = []
        return
    }

    fuzzySearch(keyword)

    // throttleFunc(keyword)
}

const clear = () => {
    data.value = []
    cacheKeyword = ''
}

const compositionupdate = event => {
    if (isSelectAll) {
        cacheKeyword = ''
        isSelectAll = false
    }
    fuzzySearch(cacheKeyword + event.data)
    console.log('compositionupdate: ', cacheKeyword + event.data)
}

const change = () => {
    cacheKeyword = ''
}

const keydown = event => {
    if (event.metaKey && event.shiftKey && event.code === 'ArrowLeft') {
        isSelectAll = true
    }
    console.log('Event: ', event)
}
</script>

<style scoped>
.fuzzy-search {
    padding: 0 20%;
    display: flex;
    margin-bottom: 50%;
}

.fuzzy-search__type .el-select {
    width: 240px;
}

.fuzzy-search .el-select {
    width: 100%;

}

/* .fuzzy-search .el-select {

} */
</style>

<style>
.fuzzy-search__type .el-select .el-input__wrapper {
    /* box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)); */
    /* border-radius: 4px 0 0 4px; */
}

.fuzzy-search__keyword .el-select .el-input__wrapper {
    /* box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)); */
    /* border-radius: 0 4px 4px 0; */
}
</style>
