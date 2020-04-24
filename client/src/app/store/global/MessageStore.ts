import { action, thunk, computed } from 'easy-peasy';
import MessageModel from 'app/interfaces/global/MessageModel';
import { MessageOption } from 'app/interfaces/global/MessageOption';


const initalOptions: MessageOption = {
    anchorOrigin: {
        vertical: "top",
        horizontal: "center",
    },
    autoHideDuration: 6000,
    message: "Hi",
    variant: "default",
}

const MessageStore: MessageModel = {
	isOpen: false,
	options: initalOptions,
	showMessage: action((state, payload) => {
        state.isOpen = true;
        state.options = {
                    ...state.options,
                    ...payload
                };
	}),
	hideMessage: action((state) => {
		state.isOpen = false;
	})
};

export default MessageStore;
