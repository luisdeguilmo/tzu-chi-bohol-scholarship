// $ git push origin main --force
// Enumerating objects: 139, done.
// Counting objects: 100% (139/139), done.
// Delta compression using up to 8 threads
// Compressing objects: 100% (88/88), done.
// Writing objects: 100% (89/89), 114.63 KiB | 1003.00 KiB/s, done.
// Total 89 (delta 49), reused 0 (delta 0), pack-reused 0 (from 0)
// remote: Resolving deltas: 100% (49/49), completed with 35 local objects.
// remote: error: GH013: Repository rule violations found for refs/heads/main.
// remote:
// remote: - GITHUB PUSH PROTECTION
// remote:   —————————————————————————————————————————
// remote:     Resolve the following violations before pushing again
// remote:
// remote:     - Push cannot contain secrets
// remote:
// remote:
// remote:      (?) Learn how to resolve a blocked push
// remote:      https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line#resolving-a-blocked-push
// remote:
// remote:
// remote:       —— Sendinblue API Key ————————————————————————————————
// remote:        locations:
// remote:          - commit: 20f176fb6b3550eb860d7040b907fc7d23a1862e
// remote:            path: .env:1
// remote:
// remote:        (?) To push, remove secret from commit(s) or follow this URL to allow the secret.
// remote:        https://github.com/klo/sample/security/secret-scanning/unblock-secret/2xrgMxdtceXjc23oRQlrpxALzVW     
// remote:
// remote:
// remote: 
// To https://github.com/klo/sample.git
//  ! [remote rejected] main -> main (push declined due to repository rule violations)
// error: failed to push some refs to 'https://github.com/klo/sample.git'