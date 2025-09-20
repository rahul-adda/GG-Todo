import { toast } from "sonner";

export default function toastHandler() {
  let lastMsg = [];

  return (status = "info", msg, options = {}) => {
    const ShowMsg = typeof msg === "string" ? msg : "invalid message";
    let indexAt = lastMsg.indexOf(msg);

    const clearMsg = () => {
      indexAt !== -1 && lastMsg.splice(indexAt, 1);
    };

    const opt = {
      action: {
        label: "X",
        onClick: clearMsg,
      },
      onDismiss: clearMsg,
      onAutoClose: clearMsg,
      position: "top-right",
      duration: 4000,
      style: {
        borderRadius: "0.6rem",
      },
      ...options,
    };

    if (indexAt === -1) {
      lastMsg.push(msg);
      indexAt = lastMsg.indexOf(msg);
      if (status === "warn") {
        toast.warning(ShowMsg, opt);
      } else if (status === "dan") {
        toast.error(ShowMsg, opt);
      } else if (status === "sus") {
        toast.success(ShowMsg, opt);
      } else if (status === "info") {
        toast.info(ShowMsg, opt);
      }
    }
  };
}
