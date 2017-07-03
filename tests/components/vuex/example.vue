<template>
</template>
<script>
    import {mapGetters} from 'vuex'
    /**
    * Partial mapping, object spread operator example
    */
    export default {
        name: 'example',
        computed: {
            total () {
                return this.$store.getters.allCustomers.length
            },
            ...mapGetters({
                duplicate: 'hasDuplicateCustomer',
                characters: 'alphaKeys'
            })
        },
        mounted () {
            console.log('Second component loaded')
        }
    }
</script>
