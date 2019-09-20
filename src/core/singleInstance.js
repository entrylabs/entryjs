function singleInstance(MyClass) {
    function getInstance(...props) {
        if (!MyClass.instance) {
            MyClass.instance = new MyClass(...props);
        }

        return MyClass.instance;
    }

    return {
        getInstance,
    };
}

export default singleInstance;
