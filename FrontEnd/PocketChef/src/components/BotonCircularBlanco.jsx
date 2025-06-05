const BotonCircularBlanco = (icon, accion) => {
    return (
    <Pressable style={styles.backarrow} onPress={() => navigation.goBack()}>
    <Image style={styles.icon} resizeMode="cover" source="BackArrow.svg" />
    </Pressable>);
    };
    const styles = StyleSheet.create({
    icon: {
    flex: 1,
    height: "100%",
    nodeWidth: "100%",
    nodeHeight: 43,
    width: "100%"
    },
    backarrow: {
    height: 43,
    width: "100%"
    }
    });
    export default BackArrow;