
<script>
    import Footer from "./Footer.svelte";
    import Header from "./Header.svelte";
    let name = "Victor";
</script>
<Header></Header>

<hr>

    <slot></slot>
<hr>
<Footer></Footer>
