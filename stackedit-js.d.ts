declare module 'stackedit-js' {
    interface StackeditFile {
        content: {
            text: string;
        };
        name: string;
        isTemporary: boolean;
    }

    interface StackeditOptions {
        [key: string]: any;
    }

    interface Stackedit {
        [x: string]: any;
        openFile(file: StackeditFile, options?: StackeditOptions): void;
    }

    const stackedit: {
        new (): Stackedit;
    };

    export default stackedit;
}
