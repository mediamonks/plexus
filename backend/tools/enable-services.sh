gcloud services enable aiplatform.googleapis.com --project monks-copydesk
gcloud services enable apigateway.googleapis.com --project monks-copydesk
gcloud services enable cloudbuild.googleapis.com --project monks-copydesk
gcloud services enable cloudfunctions.googleapis.com --project monks-copydesk
#gcloud services enable cloudtasks.googleapis.com --project monks-copydesk
gcloud services enable discoveryengine.googleapis.com --project monks-copydesk
#gcloud services enable drive.googleapis.com --project monks-copydesk
gcloud services enable firestore.googleapis.com --project monks-copydesk
gcloud services enable run.googleapis.com --project monks-copydesk
gcloud services enable servicecontrol.googleapis.com --project monks-copydesk
#gcloud services enable sheets.googleapis.com --project monks-copydesk
gcloud services enable storage.googleapis.com --project monks-copydesk
gcloud storage buckets create gs://monks-copydesk --location=europe-west1 --project monks-copydesk
gcloud firestore databases create --database=copydesk --location=europe-west1 --type=firestore-native --project=monks-copydesk
#gcloud projects add-iam-policy-binding monks-copydesk --member=serviceAccount:697990603165-compute@developer.gserviceaccount.com --role=roles/cloudbuild.builds.builder
