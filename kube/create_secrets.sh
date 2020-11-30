kubectl create secret generic fbis-notify-key --from-literal=fbis-notify-key=${NOTIFY_KEY}
kubectl create secret generic redis --from-literal=session_secret=${SESSION_SECRET}
kubectl create secret generic feedback-email --from-literal=feedback-email=${FEEDBACK_EMAIL}